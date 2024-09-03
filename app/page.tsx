"use client";
import LoadModel from "@/components/LoadModel";
import ProcessImage from "@/components/ProcessImage";
import { useState } from 'react';

export default function Home() {
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Función que se pasa a LoadModel para actualizar el estado cuando los modelos estén listos
  const handleModelsLoaded = () => {
    setModelsLoaded(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LoadModel onModelsLoaded={handleModelsLoaded} />
      {modelsLoaded && <ProcessImage />}
    </main>
  );
}
