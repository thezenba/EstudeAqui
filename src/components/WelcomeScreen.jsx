import React from 'react';

export default function WelcomeScreen({
  provasCount,
  questionsCount,
  onOpenExamSelector,
  onOpenStats,
  onOpenHelp
}) {
  return (
    <div className="study-main-area bevel-inset welcome-main-area">
      <div className="welcome-container">

        {/* CABEÇALHO DA TELA DE BOAS-VINDAS */}
        <div className="welcome-header">
          <div className="welcome-title-group">
            <svg className="welcome-icon" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="2" width="14" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 6h8M4 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <h1 className="welcome-title">EstudeAqui</h1>
          </div>
          <p className="welcome-subtitle">
            Plataforma Retrô de Simulados Oficiais, Vestibulares e Concursos Públicos
          </p>
        </div>

        {/* PAINEL CENTRAL DE AÇÃO */}
        <fieldset className="fieldset-box">
          <legend>Iniciar Sessão de Estudos</legend>
          <p className="welcome-instruction">
            Nenhuma prova está ativa no momento. Escolha abaixo como deseja praticar hoje:
          </p>

          <div className="welcome-action-list">
            <button
              className="win-btn win-btn-primary welcome-action-btn"
              onClick={() => onOpenExamSelector('individual')}
            >
              <span className="btn-icon">📋</span>
              <span><b>Selecionar Prova Específica (112 Provas)</b> — ENEM, ITA, UFU, IFTM...</span>
            </button>

            <button
              className="win-btn welcome-action-btn"
              onClick={() => onOpenExamSelector('misto_disciplina')}
            >
              <span className="btn-icon">🔀</span>
              <span><b>Simulado Misto por Disciplina</b> — Mesclar matérias de várias bancas</span>
            </button>

            <button
              className="win-btn welcome-action-btn"
              onClick={() => onOpenExamSelector('combo_provas')}
            >
              <span className="btn-icon">🧩</span>
              <span><b>Combo Personalizado</b> — Selecionar 2 ou mais provas simultâneas</span>
            </button>
          </div>
        </fieldset>

        {/* RESUMO DO ACERVO DISPONÍVEL */}
        <fieldset className="fieldset-box">
          <legend>Acervo Catalogado Disponível (100% Offline)</legend>
          <div className="welcome-catalog-grid">
            <div className="bevel-inset welcome-card-item">
              <span className="welcome-card-title">🏛️ ENEM / INEP (2015 a 2024)</span>
              <div className="welcome-card-desc">18 provas completas oficiais (1.622 questões)</div>
            </div>

            <div className="bevel-inset welcome-card-item">
              <span className="welcome-card-title">🎓 Vestibulares Tradicionais</span>
              <div className="welcome-card-desc">ITA, UFU, IFTM, USP, CEFETMINAS (1.857 questões)</div>
            </div>

            <div className="bevel-inset welcome-card-item">
              <span className="welcome-card-title">⚖️ Concursos Públicos</span>
              <div className="welcome-card-desc">FGV, CESPE, TRT-MG, Polícias (997 questões)</div>
            </div>

            <div className="bevel-inset welcome-card-item">
              <span className="welcome-card-title">🚗 DETRAN & Habilitação</span>
              <div className="welcome-card-desc">Legislação, Direção Defensiva, Mecânica (810 questões)</div>
            </div>
          </div>

          <div className="welcome-summary-text">
            Total: <b>{questionsCount.toLocaleString('pt-BR')} questões</b> com gabaritos oficiais confirmados em <b>{provasCount} provas</b>.
          </div>
        </fieldset>

        {/* FERRAMENTAS E AJUDA */}
        <div className="welcome-footer-btns">
          <button className="win-btn" onClick={onOpenStats}>
            <span>📊</span>
            <span>Histórico de Desempenho</span>
          </button>
          <button className="win-btn" onClick={onOpenHelp}>
            <span>❓</span>
            <span>Atalhos de Teclado & Ajuda</span>
          </button>
        </div>

      </div>
    </div>
  );
}
