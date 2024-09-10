import { useEffect, useState } from "react";
import SaveFacialDescriptions from "./SaveFacialDescriptions";
import RecognizeFace from "./RecognizeFace";
import * as faceapi from 'face-api.js';


const UnionModels = () =>{

    const [modelsLoaded, setModelsLoaded] = useState(false);

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


  return(
    <>
    {modelsLoaded?
        <div className="flex">
            <SaveFacialDescriptions/>
            <RecognizeFace/>
        </div>
        :<div className="absolute z-10 flex align-center items-center">
            <p>Cargando modelos . . .</p>
        </div>    

}
    </>
  )


} 
 
 export default UnionModels
