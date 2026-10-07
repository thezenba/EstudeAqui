import React from 'react';

export default function StatusBar({
  currentIndex,
  totalQuestions,
  currentExamName,
  answeredCount,
  flaggedCount,
  timerSeconds,
  mode,
  theme
}) {
  const formatTime = (seconds) => {
    if (seconds <= 0) return '00:00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const pct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="win-statusbar bevel-outset">
      <div className="status-pane bevel-inset status-pane-flex">
        <span>Questão <b>{currentIndex + 1}</b> de <b>{totalQuestions}</b> | {currentExamName || 'Simulado INEP'}</span>
      </div>

      <div className="status-pane bevel-inset status-pane-progress">
        <span>Progresso: <b>{answeredCount}/{totalQuestions}</b> ({pct}%)</span>
      </div>

      {mode === 'simulado' && (
        <div className="status-pane bevel-inset status-pane-timer">
          <span>Tempo: <b>{formatTime(timerSeconds)}</b></span>
        </div>
      )}

      <div className="status-pane bevel-inset status-pane-optional">
        <span>Marcadas: <b>{flaggedCount}</b></span>
      </div>

      <div className="status-pane bevel-inset status-pane-optional">
        <span>Banco: <b>5.799 q.</b></span>
      </div>
    </div>
  );
}
