import React from 'react';

export default function TitleBar({ title, onMinimize, onMaximize, onClose }) {
  return (
    <div className="win-titlebar">
      <div className="win-title-left">
        <svg className="win-title-icon" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="2" width="14" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 6h8M4 9h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>{title || 'EstudeAqui - Simulador & Treinamento INEP / ENEM [v2026.1]'}</span>
      </div>
      <div className="win-title-controls">
        <button className="win-btn-control" onClick={onMinimize} title="Minimizar">_</button>
        <button className="win-btn-control" onClick={onMaximize} title="Maximizar">□</button>
        <button className="win-btn-control win-btn-close" onClick={onClose} title="Fechar">✕</button>
      </div>
    </div>
  );
}
