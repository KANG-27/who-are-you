import Image from "next/image";
import { useEffect, useState } from "react";

const RecognizeFace = () => {
  const [imgSelected, setImgSelected] = useState(null);


  // Extrae la imagen seleccionada por el usuario y la vuelve una url
  const handleImageUpload = (event: any) => {
    if (event.target.files?.[0]) {
      // Crea un objeto URL para la imagen
      const reader = new FileReader();
      // Define lo que sucede cuando se lee el archivo
      reader.onload = (e: any) => {
        // Establece el atributo src de la imagen
        setImgSelected(e.target.result);
      };
      // Lee el archivo como una URL de datos
      reader.readAsDataURL(event.target.files?.[0]);
    }
    // setimgSelected(event.target)
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => handleImageUpload(event)}
      />
      {imgSelected && (
        <Image
          id="personSelected"
          src={imgSelected}
          alt="persona"
          width={500}
          height={300}
        />
      )}
    </div>
  );
};

export default RecognizeFace;
