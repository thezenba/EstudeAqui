import React from 'react';

export default function ResultsModal({
  results,
  onReviewQuestion,
  onNewExam,
  onClose
}) {
  if (!results) return null;

  const {
    examName,
    totalQuestions,
    correctCount,
    wrongCount,
    blankCount,
    percentage,
    elapsedSeconds,
    byArea,
    questionSummary
  } = results;

  const formatElapsed = (sec) => {
    if (!sec) return 'Livre';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="win-dialog bevel-outset" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        {/* Título */}
        <div className="win-titlebar">
          <span className="win-title-left">Relatório Oficial de Desempenho - {examName}</span>
          <button className="win-btn-control win-btn-close" onClick={onClose}>✕</button>
        </div>

        {/* Corpo */}
        <div className="win-dialog-body">
          {/* PLACAR GERAL */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div className="bevel-inset" style={{ flex: 1, minWidth: '180px', padding: '12px', textAlign: 'center', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Acertos Totais</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', margin: '4px 0' }}>
                {correctCount} <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>/ {totalQuestions}</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{percentage}% de aproveitamento</div>
            </div>

            <div className="bevel-inset" style={{ flex: 1, minWidth: '180px', padding: '12px', textAlign: 'center', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Resumo das Respostas</div>
              <div style={{ fontSize: '14px', marginTop: '6px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>✔ Acertos: <b>{correctCount}</b></div>
                <div>✖ Erros: <b>{wrongCount}</b></div>
                <div>○ Em branco: <b>{blankCount}</b></div>
                <div>⏱ Tempo: <b>{formatElapsed(elapsedSeconds)}</b></div>
              </div>
            </div>
          </div>

          {/* DESEMPENHO POR ÁREA DO CONHECIMENTO */}
          <fieldset className="fieldset-box">
            <legend>Desempenho por Área do Conhecimento</legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 0' }}>
              {byArea.map((item) => {
                const pctArea = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
                return (
                  <div key={item.area} style={{ borderBottom: '1px dotted var(--border-medium)', paddingBottom: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
                      <span>{item.area}</span>
                      <span>{item.correct}/{item.total} ({pctArea}%)</span>
                    </div>
                    {/* Barra de progresso retrô */}
                    <div className="bevel-inset" style={{ height: '14px', backgroundColor: 'var(--bg-panel)', position: 'relative', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pctArea}%`,
                          backgroundColor: 'var(--selected-bg)',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>

          {/* GRADE DETALHADA DE QUESTÕES (CLICÁVEL PARA REVISÃO) */}
          <fieldset className="fieldset-box">
            <legend>Gabarito & Revisão Questão a Questão (Clique para Ir)</legend>
            <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'center' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-dark)', backgroundColor: 'var(--bg-panel)' }}>
                    <th style={{ padding: '4px' }}>Nº</th>
                    <th style={{ padding: '4px', textAlign: 'left' }}>Área</th>
                    <th style={{ padding: '4px' }}>Sua Marcada</th>
                    <th style={{ padding: '4px' }}>Gabarito Oficial</th>
                    <th style={{ padding: '4px' }}>Status</th>
                    <th style={{ padding: '4px' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {questionSummary.map((q, idx) => {
                    const statusText = q.status === 'correct' ? '✔ Correta' : q.status === 'wrong' ? '✖ Incorreta' : '○ Em Branco';
                    return (
                      <tr
                        key={q.id || idx}
                        style={{
                          borderBottom: '1px solid var(--border-medium)',
                          backgroundColor: idx % 2 === 0 ? 'var(--bg-card)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '4px', fontWeight: 'bold' }}>{q.numeroQuestao}</td>
                        <td style={{ padding: '4px', textAlign: 'left' }}>{q.areaConhecimento}</td>
                        <td style={{ padding: '4px' }}><b>{q.userAnswer || '—'}</b></td>
                        <td style={{ padding: '4px' }}><b>{q.gabarito}</b></td>
                        <td style={{ padding: '4px' }}>{statusText}</td>
                        <td style={{ padding: '4px' }}>
                          <button
                            className="win-btn"
                            style={{ height: '22px', fontSize: '11px', padding: '1px 6px' }}
                            onClick={() => { onReviewQuestion(idx); onClose(); }}
                          >
                            Revisar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>

        {/* Rodapé */}
        <div className="win-dialog-footer">
          <button className="win-btn win-btn-primary" onClick={onNewExam}>
            <span>Novo Simulado</span>
          </button>
          <button className="win-btn" onClick={onClose}>
            <span>Fechar e Continuar Revisando</span>
          </button>
        </div>
      </div>
    </div>
  );
}
