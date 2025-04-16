
import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import html2canvas from 'html2canvas';

export default function Home() {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const cropAreaRef = useRef();

  const onCropComplete = useCallback(() => {}, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const marcoSize = 300;
        const aspectRatio = img.width / img.height;
        let baseZoom = 1;

        if (aspectRatio >= 1) {
          baseZoom = marcoSize / img.height;
        } else {
          baseZoom = marcoSize / img.width;
        }

        setZoom(baseZoom);
        setMinZoom(baseZoom * 0.8); // permite alejar un poco más
        setImageSrc(reader.result);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = async () => {
    const canvasArea = cropAreaRef.current;
    if (!canvasArea) return;

    const canvas = await html2canvas(canvasArea, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: true
    });

    const link = document.createElement('a');
    link.download = 'foto_espasa.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', padding: 20, fontFamily: 'sans-serif' }}>
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
            backgroundColor: '#001f4d',
            borderRadius: '50%',
            overflow: 'hidden',
            touchAction: 'none'
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            minZoom={minZoom}
            maxZoom={3}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={false}
            objectFit="cover"
            style={{
              containerStyle: { borderRadius: '50%' },
              mediaStyle: { borderRadius: '50%' },
            }}
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
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {imageSrc && (
        <>
          <br />
          <button onClick={downloadImage}>Descargar imagen</button>
        </>
      )}
    </div>
  );
}
