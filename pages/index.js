
import React, { useRef, useState } from 'react';

export default function Home() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const applyOverlay = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const baseImage = new Image();
    const overlay = new Image();

    baseImage.src = previewUrl;
    overlay.src = '/marcos/general.png';

    baseImage.onload = () => {
      canvas.width = 800;
      canvas.height = 800;
      ctx.drawImage(baseImage, 0, 0, 800, 800);
      overlay.onload = () => {
        ctx.drawImage(overlay, 0, 0, 800, 800);
      };
    };
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = `foto_espasa.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h1>Foto institucional ESPASA VW</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <br /><br />
      <button onClick={applyOverlay}>Aplicar marco</button>
      <br /><br />
      <canvas ref={canvasRef} style={{ border: '1px solid black' }}></canvas>
      <br /><br />
      <button onClick={downloadImage}>Descargar imagen</button>
    </div>
  );
}
