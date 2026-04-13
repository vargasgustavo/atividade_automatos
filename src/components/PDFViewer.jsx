import React, { useRef, useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function PDFViewer() {
  const { addToast } = useToast();
  const [pdfSrc, setPdfSrc] = useState("/Protocolos de Criptografia e Segurança de Dados_ Diffie-Hellman e Criptografia Baseada em Atributos (ABE).pdf");
  const [fileName, setFileName] = useState("Protocolos de Criptografia e Segurança de Dados_ Diffie-Hellman e Criptografia Baseada em Atributos (ABE).pdf");
  const containerRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const loadPDF = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        const newUrl = URL.createObjectURL(file);
        objectUrlRef.current = newUrl;
        setPdfSrc(newUrl);
        setFileName(file.name);
    } else {
        addToast("Falha no Upload", "Selecione um PDF válido.", "danger");
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!document.fullscreenElement) {
        if(container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        }
    } else {
        if(document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
  };

  return (
    <main id="pdf-viewer" className="tab-content" style={{ display: 'block' }}>
        <header className="page-header">
            <h1>Relatório Técnico</h1>
        </header>
        
        <section className="card viewer-card">
            <div className="file-upload-wrapper">
                <input type="file" id="pdf-input" accept="application/pdf" onChange={loadPDF} className="file-input" />
                <label htmlFor="pdf-input" className="file-label">
                    <div className="upload-icon">+</div>
                    <span>{fileName || "Escolher arquivo PDF"}</span>
                </label>
            </div>
            <div id="pdf-container" ref={containerRef}>
                <button className="expand-btn" id="expand-btn" onClick={toggleFullscreen} title="Ampliar PDF">⛶</button>
                <iframe id="pdf-frame" src={pdfSrc} frameBorder="0" style={{ display: 'block', width: '100%', height: '100%' }}></iframe>
            </div>
        </section>
    </main>
  );
}
