import Image from "next/image";
import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const RecognizeFace = () => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [existPeople, setExistPeople] = useState(false);

  // Extrae la imagen seleccionada por el usuario y la vuelve una URL
  const handleImageUpload = async (event: any) => {
    setExistPeople(true);
    if (event.target.files?.[0]) {
      // Crea un objeto URL para la imagen
      const url = URL.createObjectURL(event.target.files[0]);
      setImgUrl(url); // Asigna la URL de la imagen al estado

      // Espera que la imagen se cargue antes de comparar
      const imgElement = document.createElement("img") as HTMLImageElement; // Crear un HTMLImageElement
      imgElement.src = url;
      imgElement.onload = () => comparePhoto(imgElement); // Llama a la función una vez que la imagen esté lista
    }
  };

  const comparePhoto = async (imgElement: HTMLImageElement) => {
    const personComparate = document.getElementById("personComparate") as HTMLImageElement;
    const canvaComparate = document.getElementById("canvaComparate") as HTMLCanvasElement;

    if (personComparate && canvaComparate) {
      canvaComparate.width = personComparate.width;
      canvaComparate.height = personComparate.height;
      faceapi.matchDimensions(canvaComparate, personComparate);

      let detection = await faceapi
        .detectSingleFace(imgElement)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        // Trae el  JSON
        const descriptors = await loadDescriptorsFromJSON();
        const faceMatcher = new faceapi.FaceMatcher(descriptors);

        detection = faceapi.resizeResults(detection, personComparate);

        faceapi.draw.drawDetections(canvaComparate, detection);
        faceapi.draw.drawFaceLandmarks(canvaComparate, detection);

        const bestMatch = faceMatcher.findBestMatch(detection.descriptor).toString();
        alert(`La persona es: ${bestMatch}`);
      } else {
        console.log("No se detectó ningún rostro en la imagen seleccionada.");
      }
      setExistPeople(false);
    }
  };

  const loadDescriptorsFromJSON = async (): Promise<faceapi.LabeledFaceDescriptors[]> => {
    const response = await fetch("/descriptors.json");
    const data = await response.json();

    return data.map((person: any) => {
      const descriptors = person.data.descriptor.map(
        (d: number[]) => new Float32Array(d)
      );
      return new faceapi.LabeledFaceDescriptors(person.label, descriptors);
    });
  };

  return (
    <div>
      {existPeople && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"> 
          <span>Procesando Foto...</span>
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imgUrl && (
        <div style={{ position: "relative" }}>
          <canvas
            id="canvaComparate"
            style={{ position: "absolute", top: 0, left: 0 }}
          ></canvas>
          <Image
            src={imgUrl} // Pasamos la URL de la imagen como cadena
            id="personComparate"
            alt="Imagen comparativa"
            width={500}
            height={300}
          />
        </div>
      )}
    </div>
  );
};

export default RecognizeFace;
