import React, { useState, useMemo } from 'react';
import { getExamBlocksSummary } from '../utils/blockClassifier.js';

export default function QuestionGrid({
  questions,
  currentIndex,
  onSelectIndex,
  userAnswers,
  flaggedSet,
  timerSeconds,
  isTimerStarted,
  onStartTimer,
  isPaused,
  onTogglePause,
  mode
}) {
  const [selectedBlockId, setSelectedBlockId] = useState('todos');

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

  // Resumo consolidado dos blocos presentes na prova
  const blocksSummary = useMemo(() => {
    return getExamBlocksSummary(questions);
  }, [questions]);

  // Estatísticas de resposta por bloco
  const blockStats = useMemo(() => {
    const stats = {};
    blocksSummary.forEach(b => {
      stats[b.blocoId] = { total: b.questionsCount, answered: 0 };
    });

    questions.forEach(q => {
      const bId = q.blocoId || 'geral';
      if (stats[bId] && userAnswers[q.id] !== undefined) {
        stats[bId].answered++;
      }
    });

    return stats;
  }, [blocksSummary, questions, userAnswers]);

  // Questões filtradas pela aba de bloco selecionada
  const displayedQuestions = useMemo(() => {
    if (selectedBlockId === 'todos') {
      return questions.map((q, idx) => ({ ...q, originalIndex: idx }));
    }
    return questions
      .map((q, idx) => ({ ...q, originalIndex: idx }))
      .filter(q => q.blocoId === selectedBlockId);
  }, [questions, selectedBlockId]);

  return (
    <div className="study-sidebar">
      {/* CRONÔMETRO (MODO SIMULADO) */}
      {mode === 'simulado' && (
        <div className="timer-box bevel-inset">
          <div className="timer-label">
            {isTimerStarted ? (isPaused ? 'CRONÔMETRO PAUSADO' : 'TEMPO EM ANDAMENTO') : 'TEMPO CONFIGURADO'}
          </div>
          <div
            className="timer-digits"
            style={{
              opacity: !isTimerStarted ? 0.75 : isPaused ? 0.4 : 1,
              color: !isTimerStarted ? 'var(--text-main)' : undefined
            }}
          >
            {formatTime(timerSeconds)}
          </div>

          {!isTimerStarted ? (
            <button
              className="win-btn win-btn-primary timer-action-btn"
              onClick={onStartTimer}
              title="Clique para iniciar a contagem regressiva do tempo oficial"
            >
              <span>▶ Iniciar Cronômetro</span>
            </button>
          ) : (
            <button
              className="win-btn timer-action-btn"
              onClick={onTogglePause}
              title={isPaused ? 'Continuar tempo' : 'Pausar tempo'}
            >
              <span>{isPaused ? '▶ Continuar' : '⏸ Pausar'}</span>
            </button>
          )}
        </div>
      )}

      {/* SELETOR DE BLOCOS DE CONHECIMENTO */}
      {blocksSummary.length > 1 && (
        <div className="blocks-tab-container bevel-inset">
          <div className="blocks-tab-label">
            <span>📚 Blocos de Conhecimento:</span>
          </div>
          <div className="blocks-tab-scroll">
            <button
              className={`block-tab-btn ${selectedBlockId === 'todos' ? 'active' : ''}`}
              onClick={() => setSelectedBlockId('todos')}
              title="Exibir todas as questões da prova"
            >
              <span>Todos</span>
              <span className="block-tab-count">({answeredCount}/{total})</span>
            </button>

            {blocksSummary.map(b => {
              const bStat = blockStats[b.blocoId] || { total: b.questionsCount, answered: 0 };
              const isSelected = selectedBlockId === b.blocoId;
              return (
                <button
                  key={b.blocoId}
                  className={`block-tab-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedBlockId(b.blocoId)}
                  title={`${b.blocoNome} (${b.questionsCount} questões: ${b.range || `Q${b.firstQuestionNum} a Q${b.lastQuestionNum}`})`}
                >
                  <span>{b.icone}</span>
                  <span className="block-tab-name">{b.blocoNome.split(' ')[0]}</span>
                  <span className="block-tab-count">({bStat.answered}/{bStat.total})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GRADE DE QUESTÕES */}
      <div className="grid-box bevel-inset">
        <div className="grid-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Grade de Questões</span>
            {selectedBlockId !== 'todos' && (
              <span className="win-badge" style={{ fontSize: '10px', padding: '1px 5px' }}>
                Bloco Filtrado
              </span>
            )}
          </div>
          <span><b>{answeredCount}/{total}</b></span>
        </div>

        <div className="question-grid-scroll">
          {displayedQuestions.map((q) => {
            const isAnswered = userAnswers[q.id] !== undefined;
            const isFlagged = flaggedSet.has(q.id);
            const isActive = q.originalIndex === currentIndex;

            let itemClass = 'grid-item';
            if (isActive) itemClass += ' active';
            if (isAnswered) itemClass += ' answered';
            if (isFlagged) itemClass += ' flagged';

            return (
              <div
                key={q.id || q.originalIndex}
                className={itemClass}
                onClick={() => onSelectIndex(q.originalIndex)}
                title={`Questão ${q.numeroQuestao || q.originalIndex + 1} - ${q.blocoNome || 'Geral'}${isAnswered ? ' (Respondida: ' + userAnswers[q.id] + ')' : ' (Em branco)'}${isFlagged ? ' [Marcada]' : ''}`}
              >
                {q.numeroQuestao || q.originalIndex + 1}
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
