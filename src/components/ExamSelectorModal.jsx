import React, { useState, useMemo } from 'react';

export default function ExamSelectorModal({
  provasList,
  allQuestions,
  onStartExam,
  onClose
}) {
  // Modo de seleção via Radio buttons conforme solicitado pelo usuário
  const [selectionType, setSelectionType] = useState('individual'); // 'individual' | 'misto_disciplina' | 'combo_provas'

  // MODO 1: PROVA ESPECÍFICA
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExamCode, setSelectedExamCode] = useState(() => provasList[0]?.codigo || 168);

  // MODO 2: SIMULADO MISTO POR ÁREA
  const [selectedDisciplina, setSelectedDisciplina] = useState('Matemática');
  const [includeEnem, setIncludeEnem] = useState(true);
  const [includeVestibulares, setIncludeVestibulares] = useState(true);
  const [includeConcursos, setIncludeConcursos] = useState(true);
  const [mixedCount, setMixedCount] = useState(30);

  // MODO 3: COMBO DE PROVAS
  const [selectedExamCodesCombo, setSelectedExamCodesCombo] = useState(new Set([provasList[0]?.codigo || 168]));

  // TEMPO DO CRONÔMETRO
  const [timeOption, setTimeOption] = useState('oficial');

  // Categorias disponíveis
  const categorias = [
    { id: 'todas', label: 'Todas as Categorias' },
    { id: 'enem', label: 'ENEM / INEP' },
    { id: 'vestibular', label: 'Vestibulares (ITA, UFU, IFTM, USP...)' },
    { id: 'concurso', label: 'Concursos Públicos (FGV, CESPE, Polícias...)' },
    { id: 'habilitacao', label: 'DETRAN & Habilitação' },
    { id: 'outros', label: 'Outros Exames' }
  ];

  // Disciplinas disponíveis para Simulado Misto
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

  // Provas filtradas para Prova Específica
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

  // Atualizar seleção caso o filtro exclua a prova atual
  const effectiveExamCode = useMemo(() => {
    if (filteredProvas.some(p => Number(p.codigo) === Number(selectedExamCode))) {
      return Number(selectedExamCode);
    }
    return filteredProvas[0] ? Number(filteredProvas[0].codigo) : Number(selectedExamCode);
  }, [filteredProvas, selectedExamCode]);

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
    const numCode = Number(code);
    setSelectedExamCodesCombo(prev => {
      const next = new Set(prev);
      if (next.has(numCode)) next.delete(numCode);
      else next.add(numCode);
      return next;
    });
  };

  const handleConfirm = () => {
    if (selectionType === 'individual') {
      onStartExam({
        type: 'individual',
        examCode: Number(effectiveExamCode),
        timeOption
      });
    } else if (selectionType === 'misto_disciplina') {
      onStartExam({
        type: 'misto_disciplina',
        disciplina: selectedDisciplina,
        includeEnem,
        includeVestibulares,
        includeConcursos,
        count: Number(mixedCount),
        timeOption
      });
    } else if (selectionType === 'combo_provas') {
      if (selectedExamCodesCombo.size === 0) {
        alert('Selecione ao menos uma prova para o combo.');
        return;
      }
      onStartExam({
        type: 'combo_provas',
        examCodes: Array.from(selectedExamCodesCombo).map(Number),
        timeOption
      });
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="win-dialog bevel-outset" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        {/* TÍTULO */}
        <div className="win-titlebar">
          <span className="win-title-left">Configurar Prova ou Simulado [Banco: 5.799 Questões / 112 Provas]</span>
          <button className="win-btn-control win-btn-close" onClick={onClose}>✕</button>
        </div>

        {/* CORPO DO DIÁLOGO */}
        <div className="win-dialog-body" style={{ maxHeight: '72vh' }}>
          {/* MODO DE SELEÇÃO */}
          <fieldset className="fieldset-box">
            <legend>Modo de Seleção</legend>
            <div style={{ display: 'flex', gap: '18px', padding: '4px 0', flexWrap: 'wrap' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <input
                  type="radio"
                  name="selType"
                  checked={selectionType === 'individual'}
                  onChange={() => setSelectionType('individual')}
                />
                <b>Selecionar Prova Específica</b>
              </label>

              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <input
                  type="radio"
                  name="selType"
                  checked={selectionType === 'misto_disciplina'}
                  onChange={() => setSelectionType('misto_disciplina')}
                />
                <b>Simulado Misto por Área (Multi-Bancas)</b>
              </label>

              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <input
                  type="radio"
                  name="selType"
                  checked={selectionType === 'combo_provas'}
                  onChange={() => setSelectionType('combo_provas')}
                />
                <b>Combo de Várias Provas</b>
              </label>
            </div>
          </fieldset>

          {/* MODO 1: PROVA ESPECÍFICA */}
          {selectionType === 'individual' && (
            <fieldset className="fieldset-box">
              <legend>Selecione a Prova Específica ({filteredProvas.length} de {provasList.length} disponíveis)</legend>

              {/* Filtro por Categoria */}
              <div className="form-row">
                <label style={{ width: '130px', fontWeight: 'bold' }}>Categoria:</label>
                <select
                  className="win-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Busca por texto */}
              <div className="form-row">
                <label style={{ width: '130px', fontWeight: 'bold' }}>Buscar Prova:</label>
                <input
                  type="text"
                  className="win-input"
                  placeholder="Filtrar por nome, banca ou ano (ex: IFTM, ITA, UFU, FGV, 2024, Polícia)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="win-btn" onClick={() => setSearchTerm('')} style={{ height: '26px' }}>Limpar</button>
                )}
              </div>

              {/* Select da Prova */}
              <div className="form-row" style={{ marginTop: '8px' }}>
                <label style={{ width: '130px', fontWeight: 'bold' }}>Prova / Caderno:</label>
                <select
                  className="win-select"
                  value={effectiveExamCode}
                  onChange={(e) => setSelectedExamCode(Number(e.target.value))}
                  style={{ fontWeight: '500' }}
                >
                  {filteredProvas.map(p => (
                    <option key={p.codigo} value={p.codigo}>
                      {p.nome} ({p.totalQuestoes} questões — {p.banca})
                    </option>
                  ))}
                </select>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                * Carrega as questões na ordem original do caderno oficial com gabarito.
              </p>
            </fieldset>
          )}

          {/* MODO 2: SIMULADO MISTO POR DISCIPLINA */}
          {selectionType === 'misto_disciplina' && (
            <div>
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
                    <span><b>ENEM / INEP</b> (Questões conceituais oficiais)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={includeVestibulares}
                      onChange={(e) => setIncludeVestibulares(e.target.checked)}
                    />
                    <span><b>Vestibulares Tradicionais</b> (ITA, UFU, IFTM, USP, CEFETMINAS)</span>
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

          {/* MODO 3: COMBO DE PROVAS */}
          {selectionType === 'combo_provas' && (
            <fieldset className="fieldset-box">
              <legend>Selecione as Provas para o Combo</legend>
              <p style={{ fontSize: '12px', marginBottom: '8px' }}>
                Marque duas ou mais provas abaixo para mesclar em um único simulado unificado:
              </p>

              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '2px solid var(--border-dark)', backgroundColor: 'var(--bg-card)', padding: '4px' }}>
                {provasList.map(p => {
                  const isChecked = selectedExamCodesCombo.has(Number(p.codigo));
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
            </fieldset>
          )}

          {/* CONFIGURAÇÃO DE TEMPO DO CRONÔMETRO */}
          <fieldset className="fieldset-box">
            <legend>Configuração de Tempo do Cronômetro</legend>
            <div className="form-row">
              <label style={{ width: '130px', fontWeight: 'bold' }}>Duração:</label>
              <select
                className="win-select"
                value={timeOption}
                onChange={(e) => setTimeOption(e.target.value)}
              >
                <option value="oficial">Tempo Proporcional / Oficial (~3 minutos por questão)</option>
                <option value="330">5 Horas e 30 Minutos (ENEM Dia 1)</option>
                <option value="300">5 Horas (ENEM Dia 2)</option>
                <option value="180">3 Horas (180 min)</option>
                <option value="120">2 Horas (120 min)</option>
                <option value="60">1 Hora (60 min)</option>
                <option value="livre">Sem Limite de Tempo (Treino Livre)</option>
              </select>
            </div>
          </fieldset>
        </div>

        {/* RODAPÉ */}
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
