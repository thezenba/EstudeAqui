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
  onCheckAnswer
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
    ano,
    enunciado,
    alternativas,
    gabarito,
    observacao
  } = question;

  const isChecked = mode === 'treino' && showAnswerInstant;
  const isCorrect = selectedAnswer && selectedAnswer === gabarito;
  const tagDisciplina = disciplina || areaConhecimento || materia || materiaOriginal || 'Geral';

  return (
    <div className="study-main-area bevel-inset">
      {/* CABEÇALHO DA QUESTÃO */}
      <div className="question-header">
        <div className="question-badge-group">
          <span className="win-badge">Questão {numeroQuestao || currentIndex + 1} de {totalQuestions}</span>
          <span className="win-badge" style={{ fontWeight: 'bold' }}>{tagDisciplina}</span>
          {categoriaNome && (
            <span className="win-badge" style={{ borderStyle: 'solid' }}>{categoriaNome}</span>
          )}
          {banca && banca !== 'Não informada' && (
            <span className="win-badge" style={{ opacity: 0.9 }}>Banca: {banca}</span>
          )}
          <span className="win-badge" style={{ borderStyle: 'dotted' }}>{provaNome}</span>
        </div>

        <div>
          <button
            className={`win-btn ${isFlagged ? 'active' : ''}`}
            onClick={onToggleFlag}
            title="Marcar questão com bandeira para revisar antes de entregar (Tecla M)"
          >
            <span>{isFlagged ? '★' : '☆'}</span>
            <span>{isFlagged ? 'Marcada para Revisão' : 'Marcar para Revisar'}</span>
          </button>
        </div>
      </div>

      {/* ÁREA DE LEITURA ROLÁVEL */}
      <div className="study-scroll-wrapper">
        {/* ENUNCIADO COM SUPORTE A CLIQUE EM IMAGENS */}
        <div
          className="question-enunciado"
          dangerouslySetInnerHTML={{ __html: enunciado }}
          onClick={(e) => {
            if (e.target.tagName === 'IMG') {
              setModalImage(e.target.src);
            }
          }}
        />

        {/* LISTA DE ALTERNATIVAS */}
        <div className="alternatives-container">
          {alternativas.map((alt) => {
            const isSelected = selectedAnswer === alt.letra;
            const isStrikey = strikethroughSet && strikethroughSet.has(alt.letra);
            const isCorrectOption = isChecked && alt.letra === gabarito;
            const isWrongSelected = isChecked && isSelected && !isCorrectOption;

            let cardClass = 'alternative-card';
            if (isSelected) cardClass += ' selected';
            if (isStrikey) cardClass += ' strikethrough';
            if (isCorrectOption) cardClass += ' correct-highlight';

            return (
              <div
                key={alt.letra}
                className={cardClass}
                onClick={() => onSelectAnswer(alt.letra)}
              >
                <div className="alt-letter-box">
                  {alt.letra}
                </div>

                <div className="alt-text">
                  {alt.texto}
                </div>

                <div className="alt-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="alt-btn-strike"
                    onClick={() => onToggleStrike(alt.letra)}
                    title={isStrikey ? 'Desmarcar risco' : 'Riscar esta alternativa que você acha que está errada'}
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
                Gabarito oficial do INEP: <b>Alternativa {gabarito}</b>
                {selectedAnswer ? ` (Você assinalou: ${selectedAnswer})` : ' (Você deixou em branco)'}
              </p>
              {observacao && (
                <p style={{ marginTop: '4px', fontStyle: 'italic', fontSize: '13px' }}>
                  Nota oficial: {observacao}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BARRA DE NAVEGAÇÃO INFERIOR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', borderTop: '2px solid var(--border-medium)', paddingTop: '10px' }}>
        <button
          className="win-btn"
          onClick={onPrev}
          disabled={!hasPrev}
          title="Ir para a questão anterior (Tecla P ou Seta Esquerda)"
        >
          <span>◄</span>
          <span>Anterior (P)</span>
        </button>

        {mode === 'treino' && (
          <button
            className="win-btn win-btn-primary"
            onClick={onCheckAnswer}
            title="Conferir resposta oficial da questão imediatamente (Tecla G)"
          >
            <span>{showAnswerInstant ? 'Ocultar Gabarito' : 'Conferir Gabarito (G)'}</span>
          </button>
        )}

        <button
          className="win-btn win-btn-primary"
          onClick={onNext}
          disabled={!hasNext}
          title="Ir para a próxima questão (Tecla N ou Seta Direita)"
        >
          <span>Próxima (N)</span>
          <span>►</span>
        </button>
      </div>

      {/* MODAL DE ZOOM DE IMAGEM */}
      {modalImage && (
        <div className="modal-backdrop" onClick={() => setModalImage(null)}>
          <div className="win-dialog bevel-outset" style={{ maxWidth: '85vw', maxHeight: '85vh' }} onClick={(e) => e.stopPropagation()}>
            <div className="win-titlebar">
              <span className="win-title-left">Ampliação da Imagem - Questão {numeroQuestao}</span>
              <button className="win-btn-control win-btn-close" onClick={() => setModalImage(null)}>✕</button>
            </div>
            <div className="win-dialog-body" style={{ textAlign: 'center', backgroundColor: '#ffffff', padding: '16px' }}>
              <img src={modalImage} alt="Imagem ampliada" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
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
