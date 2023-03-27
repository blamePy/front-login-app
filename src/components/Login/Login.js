import React, { useState } from 'react';
import './Login.css';
import FacialRecognition from '../FacialRecognition/FacialRecognition';

function Login() {
    const [showFacialRecognition, setShowFacialRecognition] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setShowFacialRecognition(true);
    };

    return (
        <div className="login-container">
            <div className="login-logo">
                {/* Aquí puedes agregar el logo de tu banco o aplicación */}
            </div>
            <div className="login">
                <h1>Iniciar sesión</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Usuario</label>
                        <input type="text" id="username" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" required />
                    </div>
                    <button type="submit" className="login-button">Ingresar</button>
                </form>
                {showFacialRecognition && <FacialRecognition />}
            </div>
        </div>
    );
}

export default Login;
