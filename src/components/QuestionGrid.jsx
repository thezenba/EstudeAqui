import React from 'react';

export default function QuestionGrid({
  questions,
  currentIndex,
  onSelectIndex,
  userAnswers,
  flaggedSet,
  timerSeconds,
  isPaused,
  onTogglePause,
  mode
}) {
  const formatTime = (seconds) => {
    if (seconds <= 0) return '00:00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = flaggedSet.size;
  const total = questions.length;

  return (
    <div className="study-sidebar">
      {/* CRONÔMETRO (MODO SIMULADO) */}
      {mode === 'simulado' && (
        <div className="timer-box bevel-inset">
          <div className="timer-label">Tempo Restante</div>
          <div className="timer-digits" style={{ opacity: isPaused ? 0.4 : 1 }}>
            {formatTime(timerSeconds)}
          </div>
          <button
            className="win-btn"
            style={{ width: '100%', marginTop: '6px' }}
            onClick={onTogglePause}
          >
            <span>{isPaused ? '▶ Continuar' : '⏸ Pausar'}</span>
          </button>
        </div>
      )}

      {/* GRADE DE QUESTÕES */}
      <div className="grid-box bevel-inset">
        <div className="grid-title">
          <span>Grade de Questões</span>
          <span><b>{answeredCount}/{total}</b></span>
        </div>

        <div className="question-grid-scroll">
          {questions.map((q, idx) => {
            const isAnswered = userAnswers[q.id] !== undefined;
            const isFlagged = flaggedSet.has(q.id);
            const isActive = idx === currentIndex;

            let itemClass = 'grid-item';
            if (isActive) itemClass += ' active';
            if (isAnswered) itemClass += ' answered';
            if (isFlagged) itemClass += ' flagged';

            return (
              <div
                key={q.id || idx}
                className={itemClass}
                onClick={() => onSelectIndex(idx)}
                title={`Questão ${q.numeroQuestao || idx + 1}${isAnswered ? ' (Respondida: ' + userAnswers[q.id] + ')' : ' (Em branco)'}${isFlagged ? ' [Marcada]' : ''}`}
              >
                {q.numeroQuestao || idx + 1}
              </div>
            );
          })}
        </div>

        <div className="grid-legend">
          <span>■ Feita ({answeredCount})</span>
          <span>★ Marcada ({flaggedCount})</span>
          <span>□ Livre ({total - answeredCount})</span>
        </div>
      </div>
    </div>
  );
}
