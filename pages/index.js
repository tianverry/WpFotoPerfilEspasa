
import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import html2canvas from 'html2canvas';

export default function Home() {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const cropAreaRef = useRef();

  const onCropComplete = useCallback(() => {}, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = async () => {
    const canvasArea = cropAreaRef.current;
    if (!canvasArea) return;

    // Crear clon sin marco
    const clone = canvasArea.cloneNode(true);
    const marco = clone.querySelector('img[alt="Marco"]');
    if (marco) marco.style.display = 'none';

    // Insertar el clon fuera de pantalla
    clone.style.position = 'absolute';
    clone.style.top = '-10000px';
    document.body.appendChild(clone);

    const canvas = await html2canvas(clone);

    // Descargar imagen
    const link = document.createElement('a');
    link.download = 'foto_espasa.png';
    link.href = canvas.toDataURL();
    link.click();

    // Eliminar el clon del DOM
    document.body.removeChild(clone);
  };

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h1>Foto institucional ESPASA VW</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br /><br />

      {imageSrc && (
        <div
          ref={cropAreaRef}
          style={{
            position: 'relative',
            width: 300,
            height: 300,
            margin: '0 auto',
            overflow: 'hidden',
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={false}
          />
          <img
            src="/marcos/general.png"
            alt="Marco"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          />
        </div>
      )}

      {imageSrc && (
        <>
          <br />
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
          />
          <br /><br />
          <button onClick={downloadImage}>Descargar imagen</button>
        </>
      )}
    </div>
  );
}
