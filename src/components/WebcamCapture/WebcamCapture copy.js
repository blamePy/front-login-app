import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

function WebcamCapture() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [livenessResult, setLivenessResult] = useState('');
  const [smileDetected, setSmileDetected] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
      await faceapi.loadFaceExpressionModel(MODEL_URL);
    };
  
    loadModels().catch((error) => {
      console.error('Error al cargar los modelos:', error);
    });

    setInterval(() => {
      capture();
    }, 500);
  }, []);

  const capture = async () => {
    try {
      const imageSrc = webcamRef.current.getScreenshot();
  
      const response = await window.fetch(imageSrc);
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
          if (!smileDetected) {
            setCapturedImage(imageSrc);
            setSmileDetected(true);
          }
        } else {
          setLivenessResult('Cara no sonriente');
        }
      } else {
        setLivenessResult('No se detectó ninguna cara');
      }
    } catch (error) {
      console.error('Error en la promesa:', error);
    }
  };
  

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        height="100%"
      />
      {capturedImage && (
        <div>
          <img src={capturedImage} alt="captured" />
        </div>
      )}
      <p>Por favor, sonría para la cámara.</p>
      {livenessResult && <p>{livenessResult}</p>}
    </div>
  );
}

export default WebcamCapture;
