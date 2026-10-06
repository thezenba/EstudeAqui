import React, { useState, useEffect, useRef } from 'react';

export default function MenuBar({
  onOpenExamSelector,
  onResetExam,
  onOpenStats,
  onOpenHelp,
  onFinishExam,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  mode,
  setMode
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (name) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  return (
    <div className="win-menubar" ref={menuRef}>
      {/* ARQUIVO */}
      <div className={`win-menu-item ${openMenu === 'arquivo' ? 'active' : ''}`} onClick={() => toggleMenu('arquivo')}>
        <span><u>A</u>rquivo</span>
        {openMenu === 'arquivo' && (
          <div className="win-dropdown">
            <div className="win-dropdown-item" onClick={() => { onOpenExamSelector(); setOpenMenu(null); }}>
              <span>Novo Simulado Oficial...</span>
              <small>Ctrl+N</small>
            </div>
            <div className="win-dropdown-item" onClick={() => { onResetExam(); setOpenMenu(null); }}>
              <span>Reiniciar Simulado Atual</span>
              <small>F5</small>
            </div>
            <div className="win-dropdown-divider" />
            <div className="win-dropdown-item" onClick={() => { onFinishExam(); setOpenMenu(null); }}>
              <span>Finalizar e Ver Resultados</span>
              <small>Ctrl+Enter</small>
            </div>
            <div className="win-dropdown-divider" />
            <div className="win-dropdown-item" onClick={() => { if (confirm('Deseja reiniciar a sessão?')) window.location.reload(); }}>
              <span>Sair</span>
              <small>Alt+F4</small>
            </div>
          </div>
        )}
      </div>

      {/* MODO DE ESTUDO */}
      <div className={`win-menu-item ${openMenu === 'modo' ? 'active' : ''}`} onClick={() => toggleMenu('modo')}>
        <span><u>M</u>odo</span>
        {openMenu === 'modo' && (
          <div className="win-dropdown">
            <div className="win-dropdown-item" onClick={() => { setMode('simulado'); setOpenMenu(null); }}>
              <span>{mode === 'simulado' ? '● ' : '  '}Modo Simulado Oficial (Tempo Regressivo)</span>
            </div>
            <div className="win-dropdown-item" onClick={() => { setMode('treino'); setOpenMenu(null); }}>
              <span>{mode === 'treino' ? '● ' : '  '}Modo Treino Livre (Feedback Imediato)</span>
            </div>
          </div>
        )}
      </div>

      {/* EXIBIR */}
      <div className={`win-menu-item ${openMenu === 'exibir' ? 'active' : ''}`} onClick={() => toggleMenu('exibir')}>
        <span><u>E</u>xibir</span>
        {openMenu === 'exibir' && (
          <div className="win-dropdown">
            <div style={{ padding: '4px 16px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
              ESQUEMA DE CONTRASTE & CORES:
            </div>
            <div className="win-dropdown-item" onClick={() => { setTheme('classic-bw'); setOpenMenu(null); }}>
              <span>{theme === 'classic-bw' ? '✓ ' : '  '}1. Preto e Branco Clássico</span>
            </div>
            <div className="win-dropdown-item" onClick={() => { setTheme('low-contrast'); setOpenMenu(null); }}>
              <span>{theme === 'low-contrast' ? '✓ ' : '  '}2. Baixo Contraste Suave (Leitura Confortável)</span>
            </div>
            <div className="win-dropdown-item" onClick={() => { setTheme('high-contrast-light'); setOpenMenu(null); }}>
              <span>{theme === 'high-contrast-light' ? '✓ ' : '  '}3. Alto Contraste Claro (Acessibilidade)</span>
            </div>
            <div className="win-dropdown-item" onClick={() => { setTheme('dark-mode'); setOpenMenu(null); }}>
              <span>{theme === 'dark-mode' ? '✓ ' : '  '}4. Modo Escuro (Descanso Visual)</span>
            </div>
            <div className="win-dropdown-item" onClick={() => { setTheme('high-contrast-dark'); setOpenMenu(null); }}>
              <span>{theme === 'high-contrast-dark' ? '✓ ' : '  '}5. Alto Contraste Escuro</span>
            </div>

            <div className="win-dropdown-divider" />
            <div style={{ padding: '4px 16px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
              TAMANHO DO TEXTO:
            </div>
            <div className="win-dropdown-item" onClick={() => { setFontSize('sm'); setOpenMenu(null); }}>
              <span>{fontSize === 'sm' ? '✓ ' : '  '}Pequeno (13px)</span>
            </div>
            <div className="win-dropdown-item" onClick={() => { setFontSize('md'); setOpenMenu(null); }}>
              <span>{fontSize === 'md' ? '✓ ' : '  '}Médio Padrão (15px)</span>
            </div>
            <div className="win-dropdown-item" onClick={() => { setFontSize('lg'); setOpenMenu(null); }}>
              <span>{fontSize === 'lg' ? '✓ ' : '  '}Grande (17px)</span>
            </div>
            <div className="win-dropdown-item" onClick={() => { setFontSize('xl'); setOpenMenu(null); }}>
              <span>{fontSize === 'xl' ? '✓ ' : '  '}Extra Grande (19px)</span>
            </div>
          </div>
        )}
      </div>

      {/* FERRAMENTAS */}
      <div className={`win-menu-item ${openMenu === 'ferramentas' ? 'active' : ''}`} onClick={() => toggleMenu('ferramentas')}>
        <span><u>F</u>erramentas</span>
        {openMenu === 'ferramentas' && (
          <div className="win-dropdown">
            <div className="win-dropdown-item" onClick={() => { onOpenStats(); setOpenMenu(null); }}>
              <span>Histórico de Desempenho...</span>
            </div>
            <div className="win-dropdown-item" onClick={() => { onFinishExam(); setOpenMenu(null); }}>
              <span>Ver Cartão de Respostas</span>
            </div>
          </div>
        )}
      </div>

      {/* AJUDA */}
      <div className={`win-menu-item ${openMenu === 'ajuda' ? 'active' : ''}`} onClick={() => toggleMenu('ajuda')}>
        <span>A<u>j</u>uda</span>
        {openMenu === 'ajuda' && (
          <div className="win-dropdown">
            <div className="win-dropdown-item" onClick={() => { onOpenHelp(); setOpenMenu(null); }}>
              <span>Teclas de Atalho & Como Usar...</span>
              <small>F1</small>
            </div>
            <div className="win-dropdown-divider" />
            <div className="win-dropdown-item" onClick={() => {
              alert('EstudeAqui INEP/ENEM\nBanco Oficial com 1.802 Questões (2015-2024)\nEdição Retrô Windows XP Monocromática com Alto/Baixo Contraste e Modo Escuro.');
              setOpenMenu(null);
            }}>
              <span>Sobre o EstudeAqui...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
