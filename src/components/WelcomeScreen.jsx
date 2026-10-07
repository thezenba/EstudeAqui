import React from 'react';

export default function WelcomeScreen({
  provasCount,
  questionsCount,
  onOpenExamSelector,
  onOpenStats,
  onOpenHelp
}) {
  return (
    <div className="study-main-area bevel-inset" style={{ padding: '24px', overflowY: 'auto' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* CABEÇALHO DA TELA DE BOAS-VINDAS */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border-medium)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
            <svg style={{ width: '32px', height: '32px' }} viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="2" width="14" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 6h8M4 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>EstudeAqui</h1>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Plataforma Retrô de Simulados Oficiais, Vestibulares e Concursos Públicos
          </p>
        </div>

        {/* PAINEL CENTRAL DE AÇÃO */}
        <fieldset className="fieldset-box">
          <legend>Iniciar Sessão de Estudos</legend>
          <p style={{ fontSize: '13px', marginBottom: '14px', lineHeight: '1.5' }}>
            Nenhuma prova está ativa no momento. Escolha abaixo como deseja praticar hoje:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className="win-btn win-btn-primary"
              style={{ minHeight: '44px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 14px', touchAction: 'manipulation' }}
              onClick={() => onOpenExamSelector('individual')}
            >
              <span>📋</span>
              <span><b>Selecionar Prova Específica (112 Provas)</b> — ENEM, ITA, UFU, IFTM...</span>
            </button>

            <button
              className="win-btn"
              style={{ minHeight: '44px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 14px', touchAction: 'manipulation' }}
              onClick={() => onOpenExamSelector('misto_disciplina')}
            >
              <span>🔀</span>
              <span><b>Simulado Misto por Disciplina</b> — Mesclar matérias de várias bancas</span>
            </button>

            <button
              className="win-btn"
              style={{ minHeight: '44px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 14px', touchAction: 'manipulation' }}
              onClick={() => onOpenExamSelector('combo_provas')}
            >
              <span>🧩</span>
              <span><b>Combo Personalizado</b> — Selecionar 2 ou mais provas simultâneas</span>
            </button>
          </div>
        </fieldset>

        {/* RESUMO DO ACERVO DISPONÍVEL */}
        <fieldset className="fieldset-box">
          <legend>Acervo Catalogado Disponível (100% Offline)</legend>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '12px' }}>
            <div className="bevel-inset" style={{ padding: '10px', backgroundColor: 'var(--bg-card)' }}>
              <b>🏛️ ENEM / INEP (2015 a 2024)</b>
              <div style={{ color: 'var(--text-muted)', marginTop: '3px' }}>18 provas completas oficiais (1.622 questões)</div>
            </div>

            <div className="bevel-inset" style={{ padding: '10px', backgroundColor: 'var(--bg-card)' }}>
              <b>🎓 Vestibulares Tradicionais</b>
              <div style={{ color: 'var(--text-muted)', marginTop: '3px' }}>ITA, UFU, IFTM, USP, CEFETMINAS (1.857 questões)</div>
            </div>

            <div className="bevel-inset" style={{ padding: '10px', backgroundColor: 'var(--bg-card)' }}>
              <b>⚖️ Concursos Públicos</b>
              <div style={{ color: 'var(--text-muted)', marginTop: '3px' }}>FGV, CESPE, TRT-MG, Polícias (997 questões)</div>
            </div>

            <div className="bevel-inset" style={{ padding: '10px', backgroundColor: 'var(--bg-card)' }}>
              <b>🚗 DETRAN & Habilitação</b>
              <div style={{ color: 'var(--text-muted)', marginTop: '3px' }}>Legislação, Direção Defensiva, Mecânica (810 questões)</div>
            </div>
          </div>

          <div style={{ marginTop: '10px', fontSize: '11px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Total: <b>{questionsCount.toLocaleString('pt-BR')} questões</b> com gabaritos oficiais confirmados em <b>{provasCount} provas</b>.
          </div>
        </fieldset>

        {/* FERRAMENTAS E AJUDA */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
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
