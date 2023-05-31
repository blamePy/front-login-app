import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { FaSyncAlt } from 'react-icons/fa';

function WebcamCapture() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [livenessResult, setLivenessResult] = useState('');
  const [ResultadoReconocimiento, setResultadoReconocimiento] = useState('');
  const [smileDetected, setSmileDetected] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false);
  const [datoDelHost, setDatoDelHost] = useState('Aun no se recibio nada del host');

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
      await faceapi.loadFaceExpressionModel(MODEL_URL);
    };

    loadModels().catch((error) => {
      console.error('Error al cargar los modelos:', error);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    console.log("data aqui desde la URL: ",email);
    setDatoDelHost("Parametro recibido desde URL: " + email);
    setInterval(() => {
      capture(email);
    }, 500);
  }, []);

  
  useEffect(() => {
    const handleMessage = (event) => {
      // Puedes agregar verificaciones de seguridad aquí
      if (event.data.email) {
        console.log("data aqui: ", event.data.email);
        setDatoDelHost("Parametro recibido desde el host: " + event.data.email);
      }
    };

    window.addEventListener('message', handleMessage);

    // Asegúrate de eliminar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const capture = async (idSujeto) => {
    const imageSrc = webcamRef.current.getScreenshot();
    //console.log(imageSrc);
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    const image = await faceapi.bufferToImage(blob);
    const detections = await faceapi
      .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections) {
      const { expressions } = detections;
      console.log('Expresiones detectadas:', expressions);
      if (expressions.happy > 0.5 || expressions.surprised > 0.5) {
        const flash = document.getElementById('flash');
        flash.style.display = 'block';
        setTimeout(() => {
          flash.style.display = 'none';
        }, 100);

        setLivenessResult('Cara sonriente');
        // traer lista de imagenes de la persona 
        

        // obtenemos las lista de imagenes con sus id por sujeto
        const listImagenesIdDeSujeto = await getImagenIdPorSujeto(idSujeto);
        var imageId="";
        if (listImagenesIdDeSujeto) {
          // Aquí puedes manejar los datos devueltos por reconocimientoFacial
          imageId = listImagenesIdDeSujeto.faces[0].image_id;
        }

        // obtenemos la imagen en base64 por imagen id
        //var imagenSujeto = await getImagenPorID(imageId);        
        //if (imagenSujeto) {
        //  // Aquí puedes manejar los datos devueltos por reconocimientoFacial
        //var byteArray = imagenSujeto.body;
        //// Codificar el array de bytes en Base64
        //var base64String = base64Encode(new Blob([byteArray]));
        //console.log(base64String);
        //}

        // Llamar a reconocimientoFacial
        const data = await verificacionFacial(imageSrc, imageId);
        var similarityValue=0;
        if (data) {
          // Acceder al valor "similarity"esult.box.probability
          const result = data.result[0]; // Acceder al primer elemento del array 'result'
          similarityValue = result.similarity;
        }

        if (!smileDetected) {
          setCapturedImage(imageSrc);
          setSmileDetected(true);
          var message="";
          if(similarityValue>0.8)
          {
            message = 'OK, foto obtenida: ' + idSujeto + ' Es quien dice ser';
          }
          else {
            message = 'NOOK,  ' + idSujeto + ' no supero la prueba de loginFace';
          }
          setResultadoReconocimiento(message);
          window.parent.postMessage(message, '*');

        }
      } else {
        setLivenessResult('Cara no sonriente');
      }
    } else {
      setLivenessResult('No se detectó ninguna cara');
    }
  };

  
  const verificacionFacial = async (source_image, idImagen) => {
    // Crear los headers de la solicitud
    let myHeaders = new Headers();
    myHeaders.append("x-api-key", "b1a6efb7-34eb-40dc-a6b9-f9b56536d7e7");
    myHeaders.append("Content-Type", "application/json");
  
    // Crear el cuerpo de la solicitud
    let raw = JSON.stringify({
      "file": source_image.split(',')[1] // esto asume que source_image es una cadena base64 de la forma "data:image/jpeg;base64,..."
    });
     
    // Configurar las opciones de la solicitud
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };
    console.log(requestOptions);
    // Hacer la solicitud a la API
    try {
      const response = await fetch("http://localhost:8000/api/v1/recognition/faces/" + idImagen + "/verify", requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      // Aquí puedes manejar la respuesta de la API
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const getImagenPorID = async (idImagen) => {
    // Crear los headers de la solicitud
    let myHeaders = new Headers();
    myHeaders.append("x-api-key", "b1a6efb7-34eb-40dc-a6b9-f9b56536d7e7");
    myHeaders.append("Content-Type", "application/json");
     
    // Configurar las opciones de la solicitud
    let requestOptions = {
      method: 'GET',
      headers: myHeaders
    };
    console.log(requestOptions);
    // Hacer la solicitud a la API
    try {
      const response = await fetch("http://localhost:8000/api/v1/recognition/faces/"+idImagen + "/img", requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response;
      // Aquí puedes manejar la respuesta de la API
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };



  const getImagenIdPorSujeto = async (idSujeto) => {
    // Crear los headers de la solicitud
    let myHeaders = new Headers();
    myHeaders.append("x-api-key", "b1a6efb7-34eb-40dc-a6b9-f9b56536d7e7");
    myHeaders.append("Content-Type", "application/json");
     
    // Configurar las opciones de la solicitud
    let requestOptions = {
      method: 'GET',
      headers: myHeaders
    };
    console.log(requestOptions);
    // Hacer la solicitud a la API
    try {
      const response = await fetch("http://localhost:8000/api/v1/recognition/faces?subject="+idSujeto, requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      // Aquí puedes manejar la respuesta de la API
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

// Función para codificar el array de bytes en Base64
function base64Encode(byteArray) {
  let binary = '';
  for (let i = 0; i < byteArray.length; i++) {
    binary += String.fromCharCode(byteArray[i]);
  }
  return btoa(binary);
}

  
  const toggleMirror = () => {
    setIsMirrored(!isMirrored);
  };

  return (
    <div className="webcam-capture">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        height="100%"
        mirrored={isMirrored}
      />
      {capturedImage && (
        <div>
          <img src={capturedImage} alt="captured" />
        </div>
      )}
      <div className="guides"></div>
      <p>Por favor, sonría para la cámara.</p>
      {livenessResult && <p>{livenessResult}</p>}
      {datoDelHost && <p>{datoDelHost}</p>}
      {ResultadoReconocimiento && <p>{ResultadoReconocimiento}</p>}
      <button onClick={toggleMirror}>
        <FaSyncAlt />
      </button>
    </div>
  );
}

export default WebcamCapture;
