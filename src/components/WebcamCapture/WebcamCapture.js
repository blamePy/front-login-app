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
      capture();
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

  const capture = async () => {
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

        // Llamar a reconocimientoFacial
        const data = await reconocimientoFacial(imageSrc);
        if (data) {
          // Aquí puedes manejar los datos devueltos por reconocimientoFacial
          setResultadoReconocimiento('Persona identificada: ' + data.result[0].subjects[0].subject);
        }

        if (!smileDetected) {
          setCapturedImage(imageSrc);
          setSmileDetected(true);
          const message = 'OK, foto obtenida';
          window.parent.postMessage(message, '*');
        }
      } else {
        setLivenessResult('Cara no sonriente');
      }
    } else {
      setLivenessResult('No se detectó ninguna cara');
    }
  };

  
  const reconocimientoFacial = async (imageSrc) => {
    // Crear los headers de la solicitud
    let myHeaders = new Headers();
    myHeaders.append("x-api-key", "d2cc7bf6-9743-472a-ba14-f52a82cde7a1");
    myHeaders.append("Content-Type", "application/json");
  
    // Crear el cuerpo de la solicitud
    let raw = JSON.stringify({
      "file": imageSrc.split(',')[1] // esto asume que imageSrc es una cadena base64 de la forma "data:image/jpeg;base64,..."
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
      const response = await fetch("http://localhost:8001/api/v1/recognition/recognize?face_plugins=landmarks,gender,age", requestOptions);
  
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
