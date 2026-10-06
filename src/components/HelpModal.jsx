import React from 'react';

export default function HelpModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="win-dialog bevel-outset" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="win-titlebar">
          <span className="win-title-left">Ajuda - Atalhos de Teclado & Acessibilidade</span>
          <button className="win-btn-control win-btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="win-dialog-body">
          <fieldset className="fieldset-box">
            <legend>Atalhos de Teclado para Praticar Rápido</legend>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', fontSize: '12px' }}>
              <div><b>A, B, C, D, E</b> ou <b>1..5</b></div>
              <div>Assinala diretamente a alternativa correspondente.</div>

              <div><b>→ (Seta Dir)</b> ou <b>N</b></div>
              <div>Avança para a próxima questão.</div>

              <div><b>← (Seta Esq)</b> ou <b>P</b></div>
              <div>Retorna para a questão anterior.</div>

              <div><b>M</b> ou <b>F</b></div>
              <div>Marca ou desmarca a questão para revisão (★).</div>

              <div><b>G</b></div>
              <div>No modo Treino Livre, confere o gabarito oficial na hora.</div>

              <div><b>Esc</b></div>
              <div>Fecha janelas de diálogo e modais abertos.</div>
            </div>
          </fieldset>

          <fieldset className="fieldset-box">
            <legend>Esquemas de Contraste e Conforto Visual</legend>
            <ul style={{ paddingLeft: '18px', fontSize: '12px', lineHeight: '1.6' }}>
              <li><b>P&B Clássico:</b> Estilo clássico dos sistemas desktop com escala de cinzas.</li>
              <li><b>Baixo Contraste Suave:</b> Tons de papel aquecido e cinza fosco; reduz o cansaço visual em leituras extensas de textos de humanas e literatura.</li>
              <li><b>Alto Contraste Claro:</b> Preto e branco puros com bordas e traços reforçados para máxima nitidez.</li>
              <li><b>Modo Escuro Clássico:</b> Fundo escuro fosco e tipografia suave para estudo prolongado à noite.</li>
              <li><b>Alto Contraste Escuro:</b> Preto absoluto (#000000) e branco puro (#FFFFFF) com contraste total.</li>
            </ul>
          </fieldset>

          <fieldset className="fieldset-box">
            <legend>Sobre a Base de Questões do INEP</legend>
            <p style={{ fontSize: '12px', lineHeight: '1.5' }}>
              Esta aplicação contém <b>1.802 questões oficiais do ENEM</b> (2015 a 2024, cadernos Azul e Amarelo, Dia 1 e Dia 2), com gabarito oficial e imagens originais. Todo o banco funciona localmente no seu computador.
            </p>
          </fieldset>
        </div>

        <div className="win-dialog-footer">
          <button className="win-btn win-btn-primary" onClick={onClose}>Entendido</button>
        </div>
      </div>
    </div>
  );
}
