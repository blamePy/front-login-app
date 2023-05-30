import React, { useState } from 'react';
import './FacialRecognition.css';
import WebcamCapture from '../WebcamCapture/WebcamCapture';

function FacialRecognition() {
    const [showModal, setShowModal] = useState(true);

    const handleModalOpen = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <div className="facial-recognition">

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
