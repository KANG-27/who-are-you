"use client";

import * as faceapi from 'face-api.js';
import { useState } from 'react';

const ProcessImage = () => {
  const [descriptor, setDescriptor] = useState<Float32Array | null>(null);

  // Función para extraer el descriptor facial de una imagen
  const extractDescriptorFromImageUrl = async (imageUrl: string): Promise<Float32Array | null> => {
    try {
      const img = await faceapi.fetchImage(imageUrl);
      const detections = await faceapi.detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections && detections.descriptor) {
        return detections.descriptor;
      } else {
        console.error('No se detectó un rostro en la imagen.');
        return null;
      }
    } catch (error) {
      console.error('Error al cargar o procesar la imagen:', error);
      return null;
    }
  };

  // Función para manejar el procesamiento de la imagen
  const handleImageProcessing = async () => {
    const imageUrl = '/img/kevin.png'; // Ruta a la imagen en la carpeta `public`
    const descriptor = await extractDescriptorFromImageUrl(imageUrl);
    setDescriptor(descriptor);
    console.log('Descriptor facial:', descriptor);
  };

  return (
    <div>
      <button onClick={handleImageProcessing}>Procesar Imagen</button>
      {descriptor && <pre>{JSON.stringify(Array.from(descriptor), null, 2)}</pre>}
    </div>
  );
};

export default ProcessImage;
