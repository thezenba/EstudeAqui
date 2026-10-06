import React, { useState, useMemo } from 'react';

export default function ExamSelectorModal({
  provasList,
  allQuestions,
  onStartExam,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('individual'); // 'individual' | 'misto_disciplina' | 'combo_provas'

  // ABA 1: PROVA INDIVIDUAL
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExamCode, setSelectedExamCode] = useState(provasList[0]?.codigo || 168);

  // ABA 2: SIMULADO MISTO POR DISCIPLINA
  const [selectedDisciplina, setSelectedDisciplina] = useState('Matemática');
  const [includeEnem, setIncludeEnem] = useState(true);
  const [includeVestibulares, setIncludeVestibulares] = useState(true);
  const [includeConcursos, setIncludeConcursos] = useState(true);
  const [mixedCount, setMixedCount] = useState(30);

  // ABA 3: COMBO DE PROVAS ESPECÍFICAS
  const [selectedExamCodesCombo, setSelectedExamCodesCombo] = useState(new Set([provasList[0]?.codigo || 168]));

  // TEMPO
  const [timeOption, setTimeOption] = useState('oficial'); // 'oficial' | '180' | '120' | '60' | 'livre'

  // Categorias disponíveis
  const categorias = [
    { id: 'todas', label: 'Todas as Provas' },
    { id: 'enem', label: 'ENEM / INEP' },
    { id: 'vestibular', label: 'Vestibulares (ITA, UFU, IFTM, USP...)' },
    { id: 'concurso', label: 'Concursos Públicos (FGV, CESPE, Polícias...)' },
    { id: 'habilitacao', label: 'DETRAN & Habilitação' },
    { id: 'outros', label: 'Outros Exames' }
  ];

  // Disciplinas disponíveis no banco completo
  const disciplinas = [
    { nome: 'Matemática', desc: 'Matemática e Raciocínio Lógico' },
    { nome: 'Língua Portuguesa', desc: 'Português, Gramática e Interpretação' },
    { nome: 'Física', desc: 'Física Geral e Aplicada' },
    { nome: 'Química', desc: 'Química Geral e Orgânica' },
    { nome: 'Biologia', desc: 'Biologia e Ciências da Natureza' },
    { nome: 'História', desc: 'História do Brasil e Geral' },
    { nome: 'Geografia', desc: 'Geografia Física e Humana' },
    { nome: 'Direito & Legislação', desc: 'Direito Constitucional, Penal, Legislação' },
    { nome: 'Informática', desc: 'TI, Conhecimentos de Computação' },
    { nome: 'Legislação de Trânsito', desc: 'Código de Trânsito, Direção Defensiva' },
    { nome: 'Língua Inglesa', desc: 'Inglês e Interpretação Textual' },
    { nome: 'Conhecimentos Específicos', desc: 'Provas Especializadas' }
  ];

  // Provas filtradas para a Aba 1
  const filteredProvas = useMemo(() => {
    return provasList.filter(p => {
      const matchCat = categoryFilter === 'todas' || p.categoriaId === categoryFilter;
      const matchSearch = searchTerm === '' ||
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.banca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(p.ano).includes(searchTerm);
      return matchCat && matchSearch;
    });
  }, [provasList, categoryFilter, searchTerm]);

  // Contagem de questões disponíveis para o Simulado Misto selecionado
  const mixedAvailableCount = useMemo(() => {
    return allQuestions.filter(q => {
      if (q.disciplina !== selectedDisciplina) return false;
      if (q.categoriaId === 'enem' && !includeEnem) return false;
      if (q.categoriaId === 'vestibular' && !includeVestibulares) return false;
      if (q.categoriaId === 'concurso' && !includeConcursos) return false;
      return true;
    }).length;
  }, [allQuestions, selectedDisciplina, includeEnem, includeVestibulares, includeConcursos]);

  const handleToggleComboExam = (code) => {
    setSelectedExamCodesCombo(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleConfirm = () => {
    if (activeTab === 'individual') {
      onStartExam({
        type: 'individual',
        examCode: selectedExamCode,
        timeOption
      });
    } else if (activeTab === 'misto_disciplina') {
      onStartExam({
        type: 'misto_disciplina',
        disciplina: selectedDisciplina,
        includeEnem,
        includeVestibulares,
        includeConcursos,
        count: Number(mixedCount),
        timeOption
      });
    } else if (activeTab === 'combo_provas') {
      if (selectedExamCodesCombo.size === 0) {
        alert('Selecione ao menos uma prova para o combo.');
        return;
      }
      onStartExam({
        type: 'combo_provas',
        examCodes: Array.from(selectedExamCodesCombo),
        timeOption
      });
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="win-dialog bevel-outset" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        {/* TÍTULO */}
        <div className="win-titlebar">
          <span className="win-title-left">Central de Provas & Simulados Mistos [5.799 Questões / 112 Provas]</span>
          <button className="win-btn-control win-btn-close" onClick={onClose}>✕</button>
        </div>

        {/* ABAS ESTILO WINDOWS XP */}
        <div style={{ display: 'flex', gap: '3px', padding: '6px 12px 0 12px', backgroundColor: 'var(--bg-window)', borderBottom: '2px solid var(--border-dark)' }}>
          <button
            className={`win-btn ${activeTab === 'individual' ? 'active' : ''}`}
            onClick={() => setActiveTab('individual')}
            style={{ fontWeight: activeTab === 'individual' ? 'bold' : 'normal' }}
          >
            📋 Prova Específica (112 Provas)
          </button>
          <button
            className={`win-btn ${activeTab === 'misto_disciplina' ? 'active' : ''}`}
            onClick={() => setActiveTab('misto_disciplina')}
            style={{ fontWeight: activeTab === 'misto_disciplina' ? 'bold' : 'normal' }}
          >
            🔀 Simulado Misto por Área (Multi-Bancas)
          </button>
          <button
            className={`win-btn ${activeTab === 'combo_provas' ? 'active' : ''}`}
            onClick={() => setActiveTab('combo_provas')}
            style={{ fontWeight: activeTab === 'combo_provas' ? 'bold' : 'normal' }}
          >
            🧩 Combo de Várias Provas
          </button>
        </div>

        {/* CORPO DO DIÁLOGO */}
        <div className="win-dialog-body" style={{ maxHeight: '68vh' }}>

          {/* ABA 1: PROVA INDIVIDUAL */}
          {activeTab === 'individual' && (
            <div>
              <fieldset className="fieldset-box">
                <legend>Filtro por Categoria e Busca Rápida</legend>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {categorias.map(cat => (
                    <button
                      key={cat.id}
                      className={`win-btn ${categoryFilter === cat.id ? 'active' : ''}`}
                      onClick={() => setCategoryFilter(cat.id)}
                      style={{ fontSize: '11px', height: '24px' }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="form-row">
                  <label style={{ width: '90px', fontWeight: 'bold' }}>Pesquisar:</label>
                  <input
                    type="text"
                    className="win-input"
                    placeholder="Digite nome da prova, banca ou ano (ex: ITA, UFU, FGV, 2024, Polícia)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button className="win-btn" onClick={() => setSearchTerm('')} style={{ height: '26px' }}>Limpar</button>
                  )}
                </div>
              </fieldset>

              <fieldset className="fieldset-box">
                <legend>Selecione a Prova na Lista ({filteredProvas.length} disponíveis)</legend>
                <div style={{ maxHeight: '180px', overflowY: 'auto', border: '2px solid var(--border-dark)', backgroundColor: 'var(--bg-card)' }}>
                  {filteredProvas.map(p => {
                    const isSelected = selectedExamCode === p.codigo;
                    return (
                      <div
                        key={p.codigo}
                        onClick={() => setSelectedExamCode(p.codigo)}
                        style={{
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid var(--border-medium)',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'var(--selected-bg)' : 'transparent',
                          color: isSelected ? 'var(--selected-text)' : 'inherit',
                          fontSize: '12px'
                        }}
                      >
                        <div>
                          <b>{p.nome}</b> <span style={{ opacity: 0.8 }}>({p.banca})</span>
                          <span style={{ marginLeft: '8px', fontSize: '10px', padding: '1px 5px', border: '1px solid currentColor', borderRadius: '2px' }}>
                            {p.categoriaNome}
                          </span>
                        </div>
                        <div>
                          <b>{p.totalQuestoes} q.</b> {p.ano > 0 ? `| ${p.ano}` : ''}
                        </div>
                      </div>
                    );
                  })}
                  {filteredProvas.length === 0 && (
                    <p style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Nenhuma prova encontrada com os filtros informados.
                    </p>
                  )}
                </div>
              </fieldset>
            </div>
          )}

          {/* ABA 2: SIMULADO MISTO POR DISCIPLINA */}
          {activeTab === 'misto_disciplina' && (
            <div>
              <p style={{ fontSize: '12px', marginBottom: '10px', lineHeight: '1.4' }}>
                Monte um simulado focado em uma disciplina puxando questões do <b>ENEM</b>, de <b>Vestibulares de elite</b> (como ITA, UFU e IFTM) e de <b>Concursos Públicos</b> (como FGV, CESPE e Polícias).
              </p>

              <fieldset className="fieldset-box">
                <legend>1. Escolha a Disciplina / Área do Saber</legend>
                <div className="form-row">
                  <label style={{ width: '130px', fontWeight: 'bold' }}>Disciplina:</label>
                  <select
                    className="win-select"
                    value={selectedDisciplina}
                    onChange={(e) => setSelectedDisciplina(e.target.value)}
                  >
                    {disciplinas.map(d => (
                      <option key={d.nome} value={d.nome}>
                        {d.nome} — {d.desc}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>

              <fieldset className="fieldset-box">
                <legend>2. Origem das Questões (Quais Bancas / Tipos Mesclar)</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={includeEnem}
                      onChange={(e) => setIncludeEnem(e.target.checked)}
                    />
                    <span><b>ENEM / INEP</b> (Questões conceituais e interdisciplinares oficiais)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={includeVestibulares}
                      onChange={(e) => setIncludeVestibulares(e.target.checked)}
                    />
                    <span><b>Vestibulares Tradicionais</b> (ITA, UFU, IFTM, USP, CEFETMINAS — Questões aprofundadas)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={includeConcursos}
                      onChange={(e) => setIncludeConcursos(e.target.checked)}
                    />
                    <span><b>Concursos Públicos</b> (FGV, CESPE, TRT, Carreiras Policiais, etc.)</span>
                  </label>
                </div>
                <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  Total de questões disponíveis com essa combinação: <b>{mixedAvailableCount} questões</b>.
                </div>
              </fieldset>

              <fieldset className="fieldset-box">
                <legend>3. Quantidade de Questões no Simulado Misto</legend>
                <div className="form-row">
                  <label style={{ width: '130px', fontWeight: 'bold' }}>Tamanho:</label>
                  <select
                    className="win-select"
                    value={mixedCount}
                    onChange={(e) => setMixedCount(e.target.value)}
                  >
                    <option value="15">15 Questões (Treino Rápido)</option>
                    <option value="30">30 Questões</option>
                    <option value="45">45 Questões (Bloco Padrão)</option>
                    <option value="60">60 Questões</option>
                    <option value="90">90 Questões (Super Simulado)</option>
                  </select>
                </div>
              </fieldset>
            </div>
          )}

          {/* ABA 3: COMBO DE PROVAS */}
          {activeTab === 'combo_provas' && (
            <div>
              <p style={{ fontSize: '12px', marginBottom: '8px' }}>
                Selecione abaixo duas ou mais provas para mesclar e resolver em um único grande simulado unificado:
              </p>

              <div style={{ maxHeight: '230px', overflowY: 'auto', border: '2px solid var(--border-dark)', backgroundColor: 'var(--bg-card)', padding: '4px' }}>
                {provasList.map(p => {
                  const isChecked = selectedExamCodesCombo.has(p.codigo);
                  return (
                    <label
                      key={p.codigo}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 8px',
                        borderBottom: '1px solid var(--border-medium)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        backgroundColor: isChecked ? 'var(--btn-hover)' : 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleComboExam(p.codigo)}
                        />
                        <span><b>{p.nome}</b> <span style={{ opacity: 0.8 }}>({p.banca})</span></span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{p.totalQuestoes} q.</span>
                    </label>
                  );
                })}
              </div>

              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                Provas selecionadas para o Combo: <b>{selectedExamCodesCombo.size} provas</b>
              </div>
            </div>
          )}

          {/* CONFIGURAÇÃO COMUM DE CRONÔMETRO */}
          <fieldset className="fieldset-box" style={{ marginTop: '10px' }}>
            <legend>Tempo do Cronômetro</legend>
            <div className="form-row">
              <label style={{ width: '130px', fontWeight: 'bold' }}>Duração:</label>
              <select
                className="win-select"
                value={timeOption}
                onChange={(e) => setTimeOption(e.target.value)}
              >
                <option value="oficial">Tempo Proporcional / Oficial (~3 minutos por questão)</option>
                <option value="180">3 Horas (180 min)</option>
                <option value="120">2 Horas (120 min)</option>
                <option value="60">1 Hora (60 min)</option>
                <option value="livre">Sem Limite de Tempo (Treino Livre)</option>
              </select>
            </div>
          </fieldset>

        </div>

        {/* RODAPÉ DO MODAL */}
        <div className="win-dialog-footer">
          <button className="win-btn" onClick={onClose}>Cancelar</button>
          <button className="win-btn win-btn-primary" onClick={handleConfirm}>
            <span>Iniciar Simulado</span>
          </button>
        </div>
      </div>
    </div>
  );
}
