import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';


function WebcamCapture() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [livenessResult, setLivenessResult] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
      await faceapi.loadFaceExpressionModel(MODEL_URL);
    };
  
    loadModels().catch((error) => {
      console.error('Error al cargar los modelos:', error);
    });
  }, []);
  

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    const response = await fetch(imageSrc);
    const blob = await response.blob();
    const image = await faceapi.bufferToImage(blob);
    const detections = await faceapi
      .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections) {
      const { expressions } = detections;
      if (expressions.happy > 0.5 || expressions.surprised > 0.5) {
        setLivenessResult('Cara sonriente');
      } else {
        setLivenessResult('Cara no sonriente');
      }
    } else {
      setLivenessResult('No se detectó ninguna cara');
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
      <button onClick={capture}>Capturar imagen</button>
      {livenessResult && <p>{livenessResult}</p>}
    </div>
  );
}

export default WebcamCapture;
