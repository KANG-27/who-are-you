import * as faceapi from 'face-api.js';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const SaveFacialDescriptions = () => {
  const imgUrl = "/img/Kevin.jpg"; // Ruta correcta hacia tu imagen en la carpeta public

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detection, setDetection] = useState<faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection; }, faceapi.FaceLandmarks68>> | undefined>(undefined);

  // Cargar los modelos al montar el componente
  useEffect(() => {
    const initializeModels = async () => {
      await loadModels();
      setModelsLoaded(true); // Marcar como cargados una vez los modelos estén listos
    };

    initializeModels();
  }, []); 

  // Función para cargar los modelos
  const loadModels = async () => {
    const MODEL_URL = '/models'; // Asegúrate de tener los modelos en la carpeta `/public/models`

    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
  };

  // Función para cargar la imagen y detectar el rostro
  const cargarImagen = async () => {
    if (!modelsLoaded) {
      console.log("Los modelos aún no se han cargado");
      return;
    }

    // Asegúrate de que el código que accede a `document` se ejecute solo en el cliente
    const person = document.getElementById("person") as HTMLImageElement;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    if (person && canvas) {
      canvas.width = person.width;
      canvas.height = person.height;
      faceapi.matchDimensions(canvas, person);

      try {
        let detections = await faceapi.detectSingleFace(person).withFaceLandmarks().withFaceDescriptor();

        if (detections) {
          setDetection(detections);
          //  Esto se hace por que en la primera carga de la imagen no querda muy bien centrada la cara esto hace que
          //  se centre el recuadro
          detections = faceapi.resizeResults(detections,person)
          faceapi.draw.drawDetections(canvas, detections);
          faceapi.draw.drawFaceLandmarks(canvas, detections);

        } else {
          console.log("No se detectó el rostro");
        }
      } catch (error) {
        console.log("Error en la imagen:", error);
      }
    } else {
      console.error("Elemento de imagen o canvas no encontrado");
    }
  };

  return (
    <div>
      <button onClick={cargarImagen} disabled={!modelsLoaded}>
        {modelsLoaded ? 'Almacenar persona' : 'Cargando Modelos...'}
      </button>

      <div style={{ position: 'relative' }}>
        <canvas id="canvas" className='absolute'></canvas>
        <Image
          id="person"
          src={imgUrl}
          alt="persona"
          width={500}
          height={300}
        />
      </div>
    </div>
  );
};

export default SaveFacialDescriptions;
