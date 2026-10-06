import React, { useState } from 'react';

export default function ExamSelectorModal({
  provasList,
  onStartExam,
  onClose
}) {
  const [selectionType, setSelectionType] = useState('oficial'); // 'oficial' | 'area'
  const [selectedExamCode, setSelectedExamCode] = useState(provasList[0]?.codigo || 168);
  const [selectedArea, setSelectedArea] = useState('Matemática e suas Tecnologias');
  const [selectedYearFilter, setSelectedYearFilter] = useState('todos');
  const [questionCount, setQuestionCount] = useState(30);
  const [timeOption, setTimeOption] = useState('oficial'); // 'oficial', '180', '60', 'livre'

  const areas = [
    'Matemática e suas Tecnologias',
    'Ciências da Natureza e suas Tecnologias',
    'Ciências Humanas e suas Tecnologias',
    'Linguagens, Códigos e suas Tecnologias'
  ];

  const handleConfirm = () => {
    onStartExam({
      type: selectionType,
      examCode: selectedExamCode,
      area: selectedArea,
      year: selectedYearFilter,
      count: Number(questionCount),
      timeOption
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="win-dialog bevel-outset" onClick={(e) => e.stopPropagation()}>
        {/* Título do Diálogo */}
        <div className="win-titlebar">
          <span className="win-title-left">Configurar Prova ou Treino INEP / ENEM</span>
          <button className="win-btn-control win-btn-close" onClick={onClose}>✕</button>
        </div>

        {/* Corpo do Diálogo */}
        <div className="win-dialog-body">
          <fieldset className="fieldset-box">
            <legend>Modo de Seleção</legend>
            <div style={{ display: 'flex', gap: '20px', padding: '4px 0' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="radio"
                  name="selType"
                  checked={selectionType === 'oficial'}
                  onChange={() => setSelectionType('oficial')}
                />
                <b>Prova Oficial Completa (ENEM 2015 a 2024)</b>
              </label>

              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="radio"
                  name="selType"
                  checked={selectionType === 'area'}
                  onChange={() => setSelectionType('area')}
                />
                <b>Treino Personalizado por Área</b>
              </label>
            </div>
          </fieldset>

          {selectionType === 'oficial' ? (
            <fieldset className="fieldset-box">
              <legend>Selecione o Caderno de Prova Oficial</legend>
              <div className="form-row">
                <label style={{ width: '130px', fontWeight: 'bold' }}>Prova / Caderno:</label>
                <select
                  className="win-select"
                  value={selectedExamCode}
                  onChange={(e) => setSelectedExamCode(Number(e.target.value))}
                >
                  {provasList.map((p) => (
                    <option key={p.codigo} value={p.codigo}>
                      {p.nome} ({p.totalQuestoes} questões — {p.tipoProva || 'Azul'})
                    </option>
                  ))}
                </select>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                * Carrega as 90 questões exatamente na ordem oficial do caderno com gabarito do INEP.
              </p>
            </fieldset>
          ) : (
            <fieldset className="fieldset-box">
              <legend>Filtros de Área e Quantidade</legend>
              <div className="form-row">
                <label style={{ width: '130px', fontWeight: 'bold' }}>Área do Saber:</label>
                <select
                  className="win-select"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                >
                  {areas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label style={{ width: '130px', fontWeight: 'bold' }}>Filtrar por Ano:</label>
                <select
                  className="win-select"
                  value={selectedYearFilter}
                  onChange={(e) => setSelectedYearFilter(e.target.value)}
                >
                  <option value="todos">Todos os Anos (2015 a 2024)</option>
                  <option value="recentes">Mais Recentes (2020 a 2024)</option>
                  <option value="2024">Somente 2024</option>
                  <option value="2023">Somente 2023</option>
                  <option value="2022">Somente 2022</option>
                  <option value="2021">Somente 2021</option>
                  <option value="2020">Somente 2020</option>
                </select>
              </div>

              <div className="form-row">
                <label style={{ width: '130px', fontWeight: 'bold' }}>Quantidade:</label>
                <select
                  className="win-select"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                >
                  <option value="15">15 Questões (Treino Rápido)</option>
                  <option value="30">30 Questões</option>
                  <option value="45">45 Questões (Bloco Completo de 1 Área)</option>
                  <option value="90">90 Questões</option>
                </select>
              </div>
            </fieldset>
          )}

          <fieldset className="fieldset-box">
            <legend>Configuração de Tempo do Cronômetro</legend>
            <div className="form-row">
              <label style={{ width: '130px', fontWeight: 'bold' }}>Duração:</label>
              <select
                className="win-select"
                value={timeOption}
                onChange={(e) => setTimeOption(e.target.value)}
              >
                <option value="oficial">Tempo Oficial do ENEM (5h30 Dia 1 / 5h00 Dia 2)</option>
                <option value="180">3 Horas (180 minutos)</option>
                <option value="90">1 Hora e Meia (90 minutos)</option>
                <option value="45">45 Minutos (Modo Sprint)</option>
                <option value="livre">Sem Limite de Tempo (Treino Livre)</option>
              </select>
            </div>
          </fieldset>
        </div>

        {/* Rodapé do Diálogo */}
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
