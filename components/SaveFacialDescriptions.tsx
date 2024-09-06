import * as faceapi from 'face-api.js';
import { useEffect, useState } from 'react';


type Recognition = {
  alignedRect:any,
  descriptor:any,
  detection:any,
  landmarks:any,
  unshiftedLandmarks:any

}

const SaveFacialDescriptions = () => {
  const imgUrl = "/img/kevin.png"; // Ruta correcta hacia tu imagen en la carpeta public

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detection, setDetection] = useState(null);


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
    try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    } catch (eror){
        console.log("Error al cargar los modelos")
    }

  };


  // Función para cargar la imagen y detectar el rostro
  const cargarImagen = async () => {
    if (!modelsLoaded) {
      console.log("Los modelos aún no se han cargado");
      return;
    }

    try {
      const img = await faceapi.fetchImage(imgUrl);

      // Detectar el rostro de la imagen
      const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      
      if (detection) {
        console.log("Rostro detectado:", detection);
        // setDetection(detection)
        return detection;
      } else {
        console.log("No se detectó el rostro");
        return null;
      }
    } catch (error) {
      console.log("Error en la imagen:", error);
      return null;
    }
  };

  return (
    <div>
        <button onClick={cargarImagen} disabled={!modelsLoaded}>
            {modelsLoaded ? 'Procesar Imagen' : 'Cargando Modelos...'}
        </button>

        {detection &&
            <span>hola</span>
        }
    </div>
  );
};

export default SaveFacialDescriptions;
