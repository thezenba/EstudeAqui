import React from 'react';

export default function StatsModal({
  history,
  onClearHistory,
  onClose
}) {
  const totalSimulados = history.length;
  const totalQuestoesFeitas = history.reduce((acc, h) => acc + (h.totalQuestions || 0), 0);
  const totalAcertos = history.reduce((acc, h) => acc + (h.correctCount || 0), 0);
  const mediaAproveitamento = totalQuestoesFeitas > 0 ? Math.round((totalAcertos / totalQuestoesFeitas) * 100) : 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="win-dialog bevel-outset" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        <div className="win-titlebar">
          <span className="win-title-left">Histórico e Estatísticas de Estudos</span>
          <button className="win-btn-control win-btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="win-dialog-body">
          {/* CARDS DE RESUMO GERAL */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))', gap: '8px', marginBottom: '14px' }}>
            <div className="bevel-inset" style={{ padding: '8px', textAlign: 'center', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SIMULADOS</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{totalSimulados}</div>
            </div>
            <div className="bevel-inset" style={{ padding: '8px', textAlign: 'center', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>RESPONDIDAS</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{totalQuestoesFeitas}</div>
            </div>
            <div className="bevel-inset" style={{ padding: '8px', textAlign: 'center', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ACERTOS</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{totalAcertos}</div>
            </div>
            <div className="bevel-inset" style={{ padding: '8px', textAlign: 'center', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MÉDIA GERAL</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{mediaAproveitamento}%</div>
            </div>
          </div>

          {/* HISTÓRICO DE SIMULADOS */}
          <fieldset className="fieldset-box">
            <legend>Histórico de Simulados Realizados</legend>
            {history.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px 0' }}>
                Nenhum simulado finalizado ainda. Faça uma prova e clique em "Finalizar Prova" para registrar seu progresso!
              </p>
            ) : (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-dark)', backgroundColor: 'var(--bg-panel)', textAlign: 'left' }}>
                      <th style={{ padding: '4px' }}>Data</th>
                      <th style={{ padding: '4px' }}>Prova</th>
                      <th style={{ padding: '4px', textAlign: 'center' }}>Acertos</th>
                      <th style={{ padding: '4px', textAlign: 'center' }}>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-medium)' }}>
                        <td style={{ padding: '4px' }}>{item.date || 'Hoje'}</td>
                        <td style={{ padding: '4px', fontWeight: 'bold' }}>{item.examName}</td>
                        <td style={{ padding: '4px', textAlign: 'center' }}>{item.correctCount}/{item.totalQuestions}</td>
                        <td style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </fieldset>
        </div>

        <div className="win-dialog-footer">
          {history.length > 0 && (
            <button
              className="win-btn"
              onClick={() => {
                if (confirm('Tem certeza que deseja limpar todo o histórico de simulados?')) {
                  onClearHistory();
                }
              }}
            >
              Limpar Histórico
            </button>
          )}
          <button className="win-btn win-btn-primary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
