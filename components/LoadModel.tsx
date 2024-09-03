"use client";

import * as faceapi from 'face-api.js';
import { useEffect } from 'react';

interface LoadModelProps {
  onModelsLoaded: () => void; // Propiedad que se llama cuando los modelos están cargados
}

const LoadModel = ({ onModelsLoaded }: LoadModelProps) => {
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; // Ruta a la carpeta de modelos en `public`
      
      try {
        // Carga los modelos necesarios
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        
        onModelsLoaded(); // Notificar que los modelos han sido cargados
      } catch (error) {
        console.error('Error al cargar los modelos:', error);
      }
    };

    loadModels();
  }, [onModelsLoaded]);

  return null;
};

export default LoadModel;
