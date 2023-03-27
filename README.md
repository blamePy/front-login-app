# Aplicación de reconocimiento facial

Esta aplicación permite capturar imágenes de la cámara web y verificar si la imagen es de una cara real o una foto.

## Instalación

1. Clonar el repositorio: `git clone https://github.com/TU_USUARIO/front-webcam.git`
2. Ir al directorio del proyecto: `cd front-webcam/my-login-app`
3. Instalar dependencias: `npm install`
4. Iniciar la aplicación: `npm start`

## Uso

1. Ingresar a la sección "Reconocimiento facial"
2. Asegurarse de permitir el acceso a la cámara web
3. Hacer click en "Capturar imagen"
4. Esperar a que se realice el análisis de la imagen
5. Verificar si el mensaje de resultado indica "Cara viva" o "Foto no viva"

## Tecnologías utilizadas

- React
- react-webcam
- face-api.js

## Autor

Nombre: TU_NOMBRE

Correo electrónico: TU_CORREO_ELECTRONICO

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## Estructura del proyecto
my-login-app/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── models/
│       ├── face_landmark_68_tiny_model-weights_manifest.json
│       ├── face_landmark_68_tiny_model-shard1
│       ├── face_landmark_68_tiny_model-shard2
│       ├── face_landmark_68_tiny_model-shard3
│       ├── face_landmark_68_tiny_model-weights_manifest.json
│       ├── face_landmark_68_tiny_model-weights.bin
│       ├── face_expression_model-weights_manifest.json
│       └── face_expression_model-weights_uint8_quantized.bin
├── src/
│   ├── App.js
│   ├── components/
│   │   ├── Login/
│   │   │   ├── index.js
│   │   │   └── Login.css
│   │   └── WebcamCapture/
│   │       ├── WebcamCapture.js
│   │       └── WebcamCapture.css
│   ├── index.js
│   └── index.css
├── .dockerignore
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
└── yarn.lock
