import React, { useState } from 'react';

export default function QuestionViewer({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  isFlagged,
  onToggleFlag,
  strikethroughSet,
  onToggleStrike,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  mode,
  showAnswerInstant,
  onCheckAnswer,
  onOpenMobileGrid
}) {
  const [modalImage, setModalImage] = useState(null);

  if (!question) {
    return (
      <div className="study-main-area bevel-inset" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p>Carregando questão...</p>
      </div>
    );
  }

  const {
    numeroQuestao,
    materia,
    materiaOriginal,
    areaConhecimento,
    disciplina,
    banca,
    categoriaNome,
    provaNome,
    enunciado,
    alternativas,
    gabarito,
    observacao,
    blocoNome,
    blocoIcone
  } = question;

  const isChecked = mode === 'treino' && showAnswerInstant;
  const isCorrect = selectedAnswer && selectedAnswer === gabarito;
  const tagDisciplina = disciplina || areaConhecimento || materia || materiaOriginal || 'Geral';
  const tagBloco = blocoNome || 'Conhecimentos Gerais';

  return (
    <div className="study-main-area bevel-inset">
      {/* CABEÇALHO DA QUESTÃO COM BLOCO OFICIAL DE CONHECIMENTO */}
      <div className="question-header">
        <div className="question-badge-group">
          <span className="win-badge win-badge-primary">
            Questão {numeroQuestao || currentIndex + 1} de {totalQuestions}
          </span>
          <span className="win-badge win-badge-block" title="Bloco oficial de conhecimento desta questão">
            {blocoIcone || '📚'} {tagBloco}
          </span>
          <span className="win-badge" style={{ fontWeight: 'bold' }}>
            {tagDisciplina}
          </span>
          {categoriaNome && (
            <span className="win-badge win-badge-cat">{categoriaNome}</span>
          )}
          {provaNome && (
            <span className="win-badge win-badge-exam" title={provaNome}>
              {provaNome}
            </span>
          )}
        </div>

        <div className="question-header-actions">
          {onOpenMobileGrid && (
            <button
              className="win-btn win-btn-mobile-grid"
              onClick={onOpenMobileGrid}
              title="Abrir grade de questões e cronômetro"
            >
              <span>📋 Grade / Tempo</span>
            </button>
          )}

          <button
            className={`win-btn ${isFlagged ? 'active' : ''}`}
            onClick={onToggleFlag}
            title="Marcar questão com estrela para revisar antes de finalizar (Tecla M)"
          >
            <span>{isFlagged ? '★' : '☆'}</span>
            <span>{isFlagged ? 'Marcada' : 'Revisar (M)'}</span>
          </button>
        </div>
      </div>

      {/* ÁREA DE LEITURA ROLÁVEL COM SUPORTE A TOUCH */}
      <div className="study-scroll-wrapper">
        {/* ENUNCIADO COM WRAPPER RESPONSIVO PARA TABELAS, FÓRMULAS E IMAGENS */}
        <div className="question-content-container">
          <div
            className="question-enunciado"
            dangerouslySetInnerHTML={{ __html: enunciado }}
            onClick={(e) => {
              if (e.target.tagName === 'IMG') {
                setModalImage(e.target.src);
              }
            }}
          />
        </div>

        {/* LISTA DE ALTERNATIVAS COM ÁREA GENEROSA DE TOQUE */}
        <div className="alternatives-container">
          {alternativas.map((alt) => {
            const isSelected = selectedAnswer === alt.letra;
            const isStrikey = strikethroughSet && strikethroughSet.has(alt.letra);
            const isCorrectOption = isChecked && alt.letra === gabarito;

            let cardClass = 'alternative-card';
            if (isSelected) cardClass += ' selected';
            if (isStrikey) cardClass += ' strikethrough';
            if (isCorrectOption) cardClass += ' correct-highlight';

            return (
              <div
                key={alt.letra}
                className={cardClass}
                onClick={() => onSelectAnswer(alt.letra)}
                role="button"
                tabIndex={0}
              >
                <div className="alt-letter-box">
                  {alt.letra}
                </div>

                <div className="alt-text">
                  {alt.texto}
                </div>

                <div className="alt-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className={`alt-btn-strike ${isStrikey ? 'active' : ''}`}
                    onClick={() => onToggleStrike(alt.letra)}
                    title={isStrikey ? 'Restaurar alternativa' : 'Riscar/eliminar esta alternativa'}
                    aria-label={`Riscar alternativa ${alt.letra}`}
                  >
                    {isStrikey ? 'Desriscar' : '✕ Riscar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FEEDBACK NO MODO TREINO LIVRE */}
        {isChecked && (
          <div className="feedback-box">
            <div>
              <span className={`feedback-badge ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
                {isCorrect ? '✔ RESPOSTA CORRETA!' : '✖ RESPOSTA INCORRETA'}
              </span>
              <p style={{ marginTop: '8px', fontSize: '14px' }}>
                Gabarito oficial do exame: <b>Alternativa {gabarito}</b>
                {selectedAnswer ? ` (Você marcou: ${selectedAnswer})` : ' (Você deixou em branco)'}
              </p>
              {observacao && (
                <p style={{ marginTop: '4px', fontStyle: 'italic', fontSize: '13px' }}>
                  Nota oficial da banca: {observacao}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BARRA DE NAVEGAÇÃO INFERIOR STICKY */}
      <div className="question-nav-footer">
        <button
          className="win-btn nav-btn"
          onClick={onPrev}
          disabled={!hasPrev}
          title="Ir para a questão anterior (Tecla P ou Seta Esquerda)"
        >
          <span>◄ Anterior (P)</span>
        </button>

        {mode === 'treino' && (
          <button
            className="win-btn win-btn-primary nav-btn nav-btn-check"
            onClick={onCheckAnswer}
            title="Conferir resposta oficial da questão imediatamente (Tecla G)"
          >
            <span>{showAnswerInstant ? 'Ocultar Gabarito' : 'Conferir Gabarito (G)'}</span>
          </button>
        )}

        <button
          className="win-btn win-btn-primary nav-btn"
          onClick={onNext}
          disabled={!hasNext}
          title="Ir para a próxima questão (Tecla N ou Seta Direita)"
        >
          <span>Próxima (N) ►</span>
        </button>
      </div>

      {/* MODAL DE ZOOM DE IMAGEM */}
      {modalImage && (
        <div className="modal-backdrop" onClick={() => setModalImage(null)}>
          <div className="win-dialog bevel-outset modal-img-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="win-titlebar">
              <span className="win-title-left">Ampliação da Imagem - Questão {numeroQuestao}</span>
              <button className="win-btn-control win-btn-close" onClick={() => setModalImage(null)}>✕</button>
            </div>
            <div className="win-dialog-body" style={{ textAlign: 'center', backgroundColor: '#ffffff', padding: '16px', overflow: 'auto' }}>
              <img src={modalImage} alt="Imagem ampliada da questão" className="modal-img-preview" />
            </div>
            <div className="win-dialog-footer">
              <button className="win-btn" onClick={() => setModalImage(null)}>Fechar Visualização</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
