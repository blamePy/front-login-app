import React, { useState } from 'react';
import './FacialRecognition.css';
import WebcamCapture from '../WebcamCapture/WebcamCapture';

function FacialRecognition() {
    const [showModal, setShowModal] = useState(false);

    const handleModalOpen = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <div className="facial-recognition">
            <button onClick={handleModalOpen}>
                Autenticación facial
            </button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <WebcamCapture />
                        <button onClick={() => { console.log("Función no implementada"); }}>
                            Reconocimiento facial
                        </button>
                        <button onClick={handleModalClose}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FacialRecognition;
