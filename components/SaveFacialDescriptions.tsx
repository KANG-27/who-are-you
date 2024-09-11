import * as faceapi from 'face-api.js';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const SaveFacialDescriptions = () => {
  const imgUrl = "/img/willfarrellactor.jpg"; // Ruta correcta hacia tu imagen en la carpeta public

  const [detection, setDetection] = useState<faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection; }, faceapi.FaceLandmarks68>> | undefined>(undefined);

 

  // Función para cargar la imagen y detectar el rostro
  const cargarImagen = async () => {


    const person = document.getElementById("person") as HTMLImageElement;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    if (person && canvas) {
      canvas.width = person.width;
      canvas.height = person.height;
      faceapi.matchDimensions(canvas, person);

      try {
        let detections = await faceapi.detectSingleFace(person).withFaceLandmarks().withFaceDescriptor();

        console.log(detections)

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
      <button onClick={cargarImagen}>
        Almacenar persona 
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
