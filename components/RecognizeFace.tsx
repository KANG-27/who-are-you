import Image from "next/image";
import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const RecognizeFace = () => {
  const [imgSelected, setImgSelected] = useState<HTMLImageElement>();

  // Extrae la imagen seleccionada por el usuario y la vuelve una url
  const handleImageUpload = async (event: any) => {
    if (event.target.files?.[0]) {
      // Crea un objeto URL para la imagen
      const reader = new FileReader();
      // Define lo que sucede cuando se lee el archivo
      reader.onload = (e: any) => {
        // Establece el atributo src de la imagen
        const imgElement = document.createElement("img") as HTMLImageElement; // Crear un HTMLImageElement
        imgElement.src = e.target.result;
        setImgSelected(imgElement);
        comparePhoto(imgElement);
      };
      // Lee el archivo como una URL de datos
      reader.readAsDataURL(event.target.files?.[0]);
    }
    // setimgSelected(event.target)
  };

  const comparePhoto = async (event: HTMLImageElement) => {
    if (event) {
      let detections = await faceapi
        .detectSingleFace(event)
        .withFaceLandmarks()
        .withFaceDescriptor();

      console.log(detections);

      if (detections) {
        // Trae el  JSON
        const descriptors = await loadDescriptorsFromJSON();
        // compara la foto subida con los datos guardados
        const faceMatcher = new faceapi.FaceMatcher(descriptors);

        // Compara el descriptor facial de la imagen seleccionada con los descriptores cargados

        console.log("aqui", detections.descriptor);
        console.log("faceMatcher", faceMatcher);

        const bestMatch = faceMatcher
          .findBestMatch(detections.descriptor)
          .toString();
        // Opcional: Puedes mostrar el resultado en la interfaz de usuario
        alert(`La persona  es: ${bestMatch}`);

        // console.log("faceMatcher",faceMatcher)
        // console.log("bestMatch",bestMatch)

        // console.log("El rostro más parecido es:", bestMatch.toString());
      } else {
        console.log("No se detectó ningún rostro en la imagen seleccionada.");
      }
    }
  };

  const loadDescriptorsFromJSON = async (): Promise<
    faceapi.LabeledFaceDescriptors[]
  > => {
    const response = await fetch("/descriptors.json");
    const data = await response.json();

    return data.map((person: any) => {
      const descriptors = person.data.descriptor.map(
        (d: number[]) => new Float32Array(d) // Asegúrate de que cada descriptor sea un Float32Array
      );
      return new faceapi.LabeledFaceDescriptors(person.label, descriptors);
    });
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => handleImageUpload(event)}
      />
      {imgSelected && (
        <div>
          <canvas id="canvaComparate"></canvas>
          <Image
            src={imgSelected} // Prop obligatoria
            alt="Description of image" // Prop obligatoria
            width={500} // Prop obligatoria
            height={300} // Prop obligatoria
          />
        </div>
      )}
    </div>
  );
};

export default RecognizeFace;
