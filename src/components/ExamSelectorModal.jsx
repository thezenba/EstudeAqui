import React, { useState, useMemo } from 'react';

// Função auxiliar para encurtar e padronizar nomes de bancas longas
function cleanBanca(banca) {
  if (!banca) return '';
  if (banca.includes('INEP') || banca.includes('Instituto Nacional de Estudos')) return 'INEP';
  if (banca.includes('CEFETMINAS')) return 'CEFETMINAS';
  if (banca.includes('Cesgranrio')) return 'Cesgranrio';
  if (banca.includes('Polícia Científica')) return 'Polícia Científica';
  if (banca.includes('DIRPS')) return 'DIRPS / UFU';
  if (banca.includes('PROGRAD')) return 'PROGRAD / UFU';
  return banca;
}

// Formatar minutos em formato amigável (ex: 4h 30min)
function formatHoursMinutes(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

// Metadados das categorias e ordenação fixa
const CATEGORY_META = {
  enem: {
    id: 'enem',
    label: 'ENEM / INEP',
    groupLabel: '🎓 ENEM — Exame Nacional do Ensino Médio',
    shortBadge: 'ENEM',
    order: 1
  },
  vestibular: {
    id: 'vestibular',
    label: 'Vestibulares (ITA, UFU, IFTM, USP...)',
    groupLabel: '🏛️ Vestibulares & Institutos Federais (ITA, UFU, IFTM, USP...)',
    shortBadge: 'Vestibular',
    order: 2
  },
  concurso: {
    id: 'concurso',
    label: 'Concursos Públicos (FGV, CESPE, Polícias...)',
    groupLabel: '⚖️ Concursos Públicos (FGV, CESPE, FUNDATEC, Polícias...)',
    shortBadge: 'Concurso',
    order: 3
  },
  habilitacao: {
    id: 'habilitacao',
    label: 'DETRAN & Habilitação (26 Estados)',
    groupLabel: '🚗 DETRAN & Legislação de Trânsito (26 Estados)',
    shortBadge: 'DETRAN',
    order: 4
  },
  outros: {
    id: 'outros',
    label: 'Provas Temáticas & Ensino Fundamental/Médio',
    groupLabel: '📖 Provas Temáticas & Ensino Fundamental/Médio',
    shortBadge: 'Temático',
    order: 5
  }
};

const CATEGORY_ORDER = ['enem', 'vestibular', 'concurso', 'habilitacao', 'outros'];

// Formatar o texto de cada item no dropdown
function formatExamOption(p) {
  const shortB = cleanBanca(p.banca);
  const anoPrefix = p.ano ? `[${p.ano}] ` : '';
  return `${anoPrefix}${p.nome} — ${p.totalQuestoes} questões (${shortB})`;
}

export default function ExamSelectorModal({
  provasList,
  allQuestions,
  initialTab = 'individual',
  onStartExam,
  onClose
}) {
  // Modo de seleção via Radio buttons conforme solicitado pelo usuário
  const [selectionType, setSelectionType] = useState(initialTab || 'individual'); // 'individual' | 'misto_disciplina' | 'combo_provas'

  // MODO 1: PROVA ESPECÍFICA
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('categoria_ano'); // 'categoria_ano' | 'ano_desc' | 'nome_asc' | 'questoes_desc'
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
    { id: 'todas', label: 'Todas as Categorias (Agrupadas com Subtítulos)' },
    { id: 'enem', label: '🎓 ENEM / INEP (18 Cadernos Oficiais)' },
    { id: 'vestibular', label: '🏛️ Vestibulares (ITA, UFU, IFTM, USP...)' },
    { id: 'concurso', label: '⚖️ Concursos Públicos (FGV, CESPE, Polícias...)' },
    { id: 'habilitacao', label: '🚗 DETRAN & Habilitação (26 Estados)' },
    { id: 'outros', label: '📖 Provas Temáticas & Ensino' }
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

  // Provas filtradas e devidamente ordenadas
  const processedProvas = useMemo(() => {
    // 1. Filtragem por categoria e busca
    const filtered = provasList.filter(p => {
      const matchCat = categoryFilter === 'todas' || p.categoriaId === categoryFilter;
      const matchSearch = searchTerm === '' ||
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.banca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(p.ano).includes(searchTerm);
      return matchCat && matchSearch;
    });

    // 2. Ordenação inteligente
    return [...filtered].sort((a, b) => {
      if (sortBy === 'categoria_ano') {
        // Ordenar primeiro pela ordem fixa de categorias
        const orderA = CATEGORY_META[a.categoriaId]?.order || 99;
        const orderB = CATEGORY_META[b.categoriaId]?.order || 99;
        if (orderA !== orderB) return orderA - orderB;

        // Dentro da mesma categoria: Ano decrescente (mais recentes primeiro)
        if ((b.ano || 0) !== (a.ano || 0)) return (b.ano || 0) - (a.ano || 0);

        // Mesmo ano: Ordenação alfabética natural (ex: Dia 1 antes de Dia 2)
        return a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true, sensitivity: 'base' });
      }

      if (sortBy === 'ano_desc') {
        if ((b.ano || 0) !== (a.ano || 0)) return (b.ano || 0) - (a.ano || 0);
        return a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true });
      }

      if (sortBy === 'nome_asc') {
        return a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true });
      }

      if (sortBy === 'questoes_desc') {
        if ((b.totalQuestoes || 0) !== (a.totalQuestoes || 0)) {
          return (b.totalQuestoes || 0) - (a.totalQuestoes || 0);
        }
        return (b.ano || 0) - (a.ano || 0);
      }

      return 0;
    });
  }, [provasList, categoryFilter, searchTerm, sortBy]);

  // Se categoryFilter === 'todas' e sortBy === 'categoria_ano', montar optgroups por categoria
  const groupedProvas = useMemo(() => {
    if (categoryFilter !== 'todas' || sortBy !== 'categoria_ano') {
      return null;
    }

    const groups = [];
    CATEGORY_ORDER.forEach(catId => {
      const items = processedProvas.filter(p => p.categoriaId === catId);
      if (items.length > 0) {
        groups.push({
          id: catId,
          label: CATEGORY_META[catId]?.groupLabel || catId,
          items
        });
      }
    });
    return groups;
  }, [processedProvas, categoryFilter, sortBy]);

  // Atualizar seleção caso o filtro exclua a prova atual
  const effectiveExamCode = useMemo(() => {
    if (processedProvas.some(p => Number(p.codigo) === Number(selectedExamCode))) {
      return Number(selectedExamCode);
    }
    return processedProvas[0] ? Number(processedProvas[0].codigo) : Number(selectedExamCode);
  }, [processedProvas, selectedExamCode]);

  // Objeto completo da prova atualmente selecionada para exibir detalhes
  const selectedExamObj = useMemo(() => {
    return provasList.find(p => Number(p.codigo) === Number(effectiveExamCode));
  }, [provasList, effectiveExamCode]);

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
      <div className="win-dialog bevel-outset" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
        {/* TÍTULO */}
        <div className="win-titlebar">
          <span className="win-title-left">Configurar Prova ou Simulado [Banco: 5.799 Questões / 112 Provas]</span>
          <button className="win-btn-control win-btn-close" onClick={onClose}>✕</button>
        </div>

        {/* CORPO DO DIÁLOGO */}
        <div className="win-dialog-body" style={{ maxHeight: '74vh' }}>
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
              <legend>Selecione a Prova Específica ({processedProvas.length} de {provasList.length} disponíveis)</legend>

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

              {/* Linha com Ordenação e Busca */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Ordenar por */}
                <div className="form-row" style={{ margin: 0 }}>
                  <label style={{ width: '130px', fontWeight: 'bold' }}>Ordenar por:</label>
                  <select
                    className="win-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="categoria_ano">Por Categoria (Mais Recentes)</option>
                    <option value="ano_desc">Ano (Mais recentes primeiro)</option>
                    <option value="nome_asc">Nome da Prova (A - Z)</option>
                    <option value="questoes_desc">Qtd. de Questões (Maior 1º)</option>
                  </select>
                </div>

                {/* Busca por texto */}
                <div className="form-row" style={{ margin: 0 }}>
                  <label style={{ width: '90px', fontWeight: 'bold' }}>Buscar:</label>
                  <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                    <input
                      type="text"
                      className="win-input"
                      placeholder="Filtrar nome, banca ou ano..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    {searchTerm && (
                      <button className="win-btn" onClick={() => setSearchTerm('')} style={{ height: '24px', padding: '0 6px' }}>✕</button>
                    )}
                  </div>
                </div>
              </div>

              {/* Select da Prova com Suporte a Optgroups e Formatação Clara */}
              <div className="form-row" style={{ marginTop: '10px' }}>
                <label style={{ width: '130px', fontWeight: 'bold' }}>Prova / Caderno:</label>
                <select
                  className="win-select"
                  value={effectiveExamCode}
                  onChange={(e) => setSelectedExamCode(Number(e.target.value))}
                  style={{ fontWeight: '500', minHeight: '30px' }}
                >
                  {groupedProvas ? (
                    groupedProvas.map(group => (
                      <optgroup
                        key={group.id}
                        label={`${group.label} (${group.items.length} ${group.items.length === 1 ? 'prova' : 'provas'})`}
                      >
                        {group.items.map(p => (
                          <option key={p.codigo} value={p.codigo}>
                            {formatExamOption(p)}
                          </option>
                        ))}
                      </optgroup>
                    ))
                  ) : (
                    processedProvas.map(p => (
                      <option key={p.codigo} value={p.codigo}>
                        {formatExamOption(p)}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Cartão de Detalhes da Prova Selecionada */}
              {selectedExamObj && (
                <div
                  className="bevel-inset"
                  style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
                      {selectedExamObj.nome}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        border: '1px solid var(--border-dark)',
                        backgroundColor: 'var(--bg-main)',
                        fontWeight: 'bold'
                      }}
                    >
                      {CATEGORY_META[selectedExamObj.categoriaId]?.shortBadge || 'PROVA'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '11px', flexWrap: 'wrap', marginTop: '2px' }}>
                    <span>Ano Oficial: <b>{selectedExamObj.ano || '—'}</b></span>
                    <span>Banca Examinadora: <b>{cleanBanca(selectedExamObj.banca)}</b></span>
                    <span>Total de Questões: <b>{selectedExamObj.totalQuestoes}</b></span>
                    <span>Tempo Oficial Sugerido: <b>~{formatHoursMinutes(selectedExamObj.totalQuestoes * 3)}</b></span>
                  </div>
                </div>
              )}

              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                * Carrega todas as questões na ordem original do caderno oficial com gabaritos confirmados.
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

              <div style={{ maxHeight: '220px', overflowY: 'auto', border: '2px solid var(--border-dark)', backgroundColor: 'var(--bg-card)', padding: '4px' }}>
                {CATEGORY_ORDER.map(catId => {
                  const catItems = provasList
                    .filter(p => p.categoriaId === catId)
                    .sort((a, b) => ((b.ano || 0) - (a.ano || 0)) || a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true }));
                  if (catItems.length === 0) return null;
                  return (
                    <div key={catId} style={{ marginBottom: '8px' }}>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          padding: '3px 6px',
                          backgroundColor: 'var(--bg-main)',
                          borderBottom: '1px solid var(--border-medium)',
                          position: 'sticky',
                          top: 0,
                          zIndex: 1
                        }}
                      >
                        {CATEGORY_META[catId]?.groupLabel || catId} ({catItems.length} provas)
                      </div>
                      {catItems.map(p => {
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
                              <span>
                                {p.ano ? <b>[{p.ano}] </b> : null}
                                <b>{p.nome}</b> <span style={{ opacity: 0.8 }}>({cleanBanca(p.banca)})</span>
                              </span>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{p.totalQuestoes} q.</span>
                          </label>
                        );
                      })}
                    </div>
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
