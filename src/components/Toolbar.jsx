import React from 'react';

export default function Toolbar({
  examStarted,
  onGoHome,
  onOpenExamSelector,
  onFinishExam,
  onOpenStats,
  onOpenHelp,
  mode,
  setMode,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  isTimerStarted,
  onStartTimer,
  isPaused,
  onTogglePause
}) {
  const themes = [
    { id: 'classic-bw', label: 'P&B Clássico' },
    { id: 'low-contrast', label: 'Baixo Contraste' },
    { id: 'high-contrast-light', label: 'Alto Contraste Claro' },
    { id: 'dark-mode', label: 'Modo Escuro' },
    { id: 'high-contrast-dark', label: 'Alto Contraste Escuro' }
  ];

  const cycleTheme = () => {
    const idx = themes.findIndex(t => t.id === theme);
    const nextIdx = (idx + 1) % themes.length;
    setTheme(themes[nextIdx].id);
  };

  const cycleFontSize = () => {
    const sizes = ['sm', 'md', 'lg', 'xl'];
    const idx = sizes.indexOf(fontSize);
    const nextIdx = (idx + 1) % sizes.length;
    setFontSize(sizes[nextIdx]);
  };

  const currentThemeLabel = themes.find(t => t.id === theme)?.label || 'Tema';

  return (
    <div className="win-toolbar">
      {/* BOTÃO TELA INICIAL */}
      <button
        className={`win-btn ${!examStarted ? 'active' : ''}`}
        onClick={onGoHome}
        title="Voltar à tela inicial de seleção e boas-vindas"
      >
        <span>🏠</span>
        <span>Início</span>
      </button>

      <button className="win-btn win-btn-primary" onClick={() => onOpenExamSelector('individual')} title="Selecionar uma nova prova ou treino">
        <span>📋</span>
        <span>Selecionar Prova</span>
      </button>

      <button
        className={`win-btn ${mode === 'simulado' ? 'active' : ''}`}
        onClick={() => setMode('simulado')}
        title="Modo Prova Oficial com tempo cronometrado"
      >
        <span>⏱</span>
        <span>Simulado Oficial</span>
      </button>

      <button
        className={`win-btn ${mode === 'treino' ? 'active' : ''}`}
        onClick={() => setMode('treino')}
        title="Modo Prática Livre com conferência instantânea de gabarito"
      >
        <span>🎯</span>
        <span>Treino Livre</span>
      </button>

      <div className="win-toolbar-separator" />

      {/* CONTROLE DE TEMPO (CRONÔMETRO) */}
      {examStarted && mode === 'simulado' && (
        !isTimerStarted ? (
          <button
            className="win-btn win-btn-primary"
            onClick={onStartTimer}
            title="Iniciar a contagem do cronômetro"
            style={{ fontWeight: 'bold' }}
          >
            <span>▶</span>
            <span>Iniciar Tempo</span>
          </button>
        ) : (
          <button className="win-btn" onClick={onTogglePause} title={isPaused ? 'Retomar tempo' : 'Pausar tempo'}>
            <span>{isPaused ? '▶' : '⏸'}</span>
            <span>{isPaused ? 'Retomar' : 'Pausar'}</span>
          </button>
        )
      )}

      {examStarted && (
        <button className="win-btn" onClick={onFinishExam} title="Concluir simulado e ver nota/relatório">
          <span>🏁</span>
          <span>Finalizar Prova</span>
        </button>
      )}

      <div className="win-toolbar-separator" />

      {/* BOTÃO CICLO DE TEMA / CONTRASTE */}
      <button className="win-btn" onClick={cycleTheme} title="Clique para alternar entre Alto Contraste, Baixo Contraste e Modo Escuro">
        <span>🌗</span>
        <span>Contraste: <b>{currentThemeLabel}</b></span>
      </button>

      {/* BOTÃO ESCALA DE FONTE */}
      <button className="win-btn" onClick={cycleFontSize} title="Ajustar tamanho da fonte para leitura confortável">
        <span>Aa</span>
        <span>Fonte: {fontSize.toUpperCase()}</span>
      </button>

      <div className="win-toolbar-separator" />

      <button className="win-btn" onClick={onOpenStats} title="Ver histórico e estatísticas acumuladas">
        <span>📊</span>
        <span>Estatísticas</span>
      </button>

      <button className="win-btn" onClick={onOpenHelp} title="Ver teclas de atalho e ajuda">
        <span>❓</span>
        <span>Ajuda (F1)</span>
      </button>
    </div>
  );
}
