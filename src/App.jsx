import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TitleBar from './components/TitleBar.jsx';
import MenuBar from './components/MenuBar.jsx';
import Toolbar from './components/Toolbar.jsx';
import QuestionViewer from './components/QuestionViewer.jsx';
import QuestionGrid from './components/QuestionGrid.jsx';
import StatusBar from './components/StatusBar.jsx';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import ExamSelectorModal from './components/ExamSelectorModal.jsx';
import ResultsModal from './components/ResultsModal.jsx';
import StatsModal from './components/StatsModal.jsx';
import HelpModal from './components/HelpModal.jsx';

export default function App() {
  // Configurações de Aparência
  const [theme, setTheme] = useState(() => localStorage.getItem('estudeaqui_theme') || 'classic-bw');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('estudeaqui_font') || 'md');

  // Estado dos Dados
  const [loading, setLoading] = useState(true);
  const [allQuestions, setAllQuestions] = useState([]);
  const [provasList, setProvasList] = useState([]);

  // Estado da Sessão (Tela Inicial vs Prova Ativa)
  const [examStarted, setExamStarted] = useState(false);
  const [mode, setMode] = useState('simulado'); // 'simulado' | 'treino'
  const [currentExam, setCurrentExam] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Respostas e Marcadores do Usuário
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedSet, setFlaggedSet] = useState(new Set());
  const [strikethroughMap, setStrikethroughMap] = useState({});
  const [showAnswerInstant, setShowAnswerInstant] = useState(false);

  // Cronômetro (Começa Desativado / Aguardando Início)
  const [timerSeconds, setTimerSeconds] = useState(3 * 3600);
  const [initialSeconds, setInitialSeconds] = useState(3 * 3600);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Modais
  const [activeModal, setActiveModal] = useState(null); // 'selector' | 'results' | 'stats' | 'help' | null
  const [selectorInitialTab, setSelectorInitialTab] = useState('individual');
  const [resultsData, setResultsData] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('estudeaqui_history')) || [];
    } catch {
      return [];
    }
  });

  // Atualizar tema no body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('estudeaqui_theme', theme);
  }, [theme]);

  // Atualizar tamanho da fonte no body
  useEffect(() => {
    document.body.className = `font-${fontSize}`;
    localStorage.setItem('estudeaqui_font', fontSize);
  }, [fontSize]);

  // Carregar banco de dados na inicialização
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let resProvas = await fetch('/data/provas_completo.json');
        let resQuestoes = await fetch('/data/questoes_completo.json');

        if (!resProvas.ok || !resQuestoes.ok) {
          resProvas = await fetch('/data/provas_inep.json');
          resQuestoes = await fetch('/data/questoes_inep.json');
        }

        const provasListData = await resProvas.json();
        const questoesData = await resQuestoes.json();

        setProvasList(provasListData);
        setAllQuestions(questoesData);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar banco de dados local:', err);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Cronômetro regressivo (SÓ CONTA SE examStarted === true E isTimerStarted === true)
  useEffect(() => {
    if (loading || !examStarted || mode !== 'simulado' || !isTimerStarted || isPaused || timerSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, examStarted, mode, isTimerStarted, isPaused, timerSeconds]);

  // Iniciar Prova, Treino Misto ou Combo
  const handleStartExam = (config) => {
    let filtered = [];
    let examName = '';
    let duration = 0;

    const isIndividual = config.type === 'individual' || config.type === 'oficial';

    if (isIndividual) {
      const codeNum = Number(config.examCode);
      const selected = provasList.find(p => Number(p.codigo) === codeNum) || provasList[0];
      if (selected) {
        filtered = allQuestions.filter(q => Number(q.provaId) === Number(selected.codigo));
        examName = `${selected.nome} (${selected.banca || 'Oficial'})`;
        setCurrentExam(selected);
      }
    } else if (config.type === 'misto_disciplina') {
      filtered = allQuestions.filter(q => {
        if (q.disciplina !== config.disciplina) return false;
        if (q.categoriaId === 'enem' && !config.includeEnem) return false;
        if (q.categoriaId === 'vestibular' && !config.includeVestibulares) return false;
        if (q.categoriaId === 'concurso' && !config.includeConcursos) return false;
        return true;
      });

      filtered = [...filtered].sort(() => Math.random() - 0.5).slice(0, config.count);
      filtered = filtered.map((q, idx) => ({ ...q, numeroQuestao: idx + 1 }));

      examName = `Simulado Misto: ${config.disciplina} (${filtered.length} questões multi-bancas)`;
      setCurrentExam({ codigo: 0, nome: examName, dia: 1, banca: 'Multi-Bancas' });
    } else if (config.type === 'combo_provas') {
      const codes = (config.examCodes || []).map(Number);
      const selectedExams = provasList.filter(p => codes.includes(Number(p.codigo)));
      filtered = allQuestions.filter(q => codes.includes(Number(q.provaId)));

      examName = `Combo (${selectedExams.length} Provas: ${selectedExams.map(p => p.nome).slice(0, 2).join(', ')}${selectedExams.length > 2 ? '...' : ''})`;
      setCurrentExam({ codigo: 0, nome: examName, dia: 1, banca: 'Combo Personalizado' });
    }

    if (!filtered || filtered.length === 0) {
      alert('Nenhuma questão encontrada para a prova ou combinação selecionada.');
      return;
    }

    // Ordenar questões pelo número oficial
    filtered.sort((a, b) => (Number(a.numeroQuestao) || 0) - (Number(b.numeroQuestao) || 0));

    // Duração do tempo
    if (config.timeOption === 'oficial') {
      duration = Math.round(filtered.length * 3 * 60);
    } else if (config.timeOption !== 'livre') {
      duration = Number(config.timeOption) * 60;
    }

    // Carregar a prova e inicializar estados
    setExamQuestions(filtered);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedSet(new Set());
    setStrikethroughMap({});
    setShowAnswerInstant(false);
    setTimerSeconds(duration);
    setInitialSeconds(duration);
    setIsTimerStarted(false); // O cronômetro começa DESATIVADO até o usuário clicar em Iniciar
    setIsPaused(false);
    setExamStarted(true); // Exibe a prova na tela
    setActiveModal(null);
  };

  // Voltar para a tela inicial
  const handleGoHome = () => {
    if (examStarted && Object.keys(userAnswers).length > 0) {
      if (!confirm('Deseja voltar à tela inicial? Seu progresso atual nesta prova continuará guardado.')) {
        return;
      }
    }
    setExamStarted(false);
  };

  // Abrir seletor com aba específica
  const handleOpenSelector = (tab = 'individual') => {
    setSelectorInitialTab(tab);
    setActiveModal('selector');
  };

  // Iniciar Cronômetro
  const handleStartTimer = () => {
    setIsTimerStarted(true);
    setIsPaused(false);
  };

  // Resetar a Prova Atual
  const handleResetCurrentExam = () => {
    if (!examStarted) return;
    if (confirm('Deseja reiniciar a prova atual? Suas respostas serão limpas.')) {
      setUserAnswers({});
      setFlaggedSet(new Set());
      setStrikethroughMap({});
      setCurrentIndex(0);
      setShowAnswerInstant(false);
      setTimerSeconds(initialSeconds);
      setIsTimerStarted(false);
      setIsPaused(false);
    }
  };

  // Finalizar e Corrigir
  const handleFinishExam = useCallback((tempoEsgotado = false) => {
    if (!examStarted || examQuestions.length === 0) return;

    let correctCount = 0;
    let wrongCount = 0;
    let blankCount = 0;

    const areaStats = {};
    const questionSummary = [];

    examQuestions.forEach(q => {
      const userAns = userAnswers[q.id];
      const isBlank = userAns === undefined;
      const isCorrect = !isBlank && userAns === q.gabarito;

      if (isBlank) blankCount++;
      else if (isCorrect) correctCount++;
      else wrongCount++;

      const area = q.disciplina || q.areaConhecimento || 'Geral';
      if (!areaStats[area]) {
        areaStats[area] = { area, total: 0, correct: 0 };
      }
      areaStats[area].total++;
      if (isCorrect) areaStats[area].correct++;

      questionSummary.push({
        id: q.id,
        numeroQuestao: q.numeroQuestao,
        areaConhecimento: area,
        userAnswer: userAns || null,
        gabarito: q.gabarito,
        status: isBlank ? 'blank' : isCorrect ? 'correct' : 'wrong'
      });
    });

    const total = examQuestions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const elapsedSeconds = initialSeconds > 0 ? initialSeconds - timerSeconds : 0;

    const results = {
      examName: currentExam?.nome || 'Simulado',
      date: new Date().toLocaleDateString('pt-BR'),
      totalQuestions: total,
      correctCount,
      wrongCount,
      blankCount,
      percentage,
      elapsedSeconds,
      byArea: Object.values(areaStats),
      questionSummary
    };

    setResultsData(results);
    setActiveModal('results');

    // Salvar no histórico local
    const newHistory = [results, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('estudeaqui_history', JSON.stringify(newHistory));

    if (tempoEsgotado) {
      alert('O tempo oficial do simulado terminou! O gabarito foi gerado.');
    }
  }, [examStarted, examQuestions, userAnswers, currentExam, initialSeconds, timerSeconds, history]);

  // Ações nas Questões
  const currentQuestion = examQuestions[currentIndex] || null;

  const handleSelectAnswer = (letra) => {
    if (!currentQuestion) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: letra
    }));
    setShowAnswerInstant(false);
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedSet(prev => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
      else next.add(currentQuestion.id);
      return next;
    });
  };

  const handleToggleStrike = (letra) => {
    if (!currentQuestion) return;
    setStrikethroughMap(prev => {
      const currentSet = new Set(prev[currentQuestion.id] || []);
      if (currentSet.has(letra)) currentSet.delete(letra);
      else currentSet.add(letra);
      return { ...prev, [currentQuestion.id]: currentSet };
    });
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswerInstant(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswerInstant(false);
    }
  };

  // Teclas de Atalho
  useEffect(() => {
    function handleKeyDown(e) {
      if (activeModal !== null) {
        if (e.key === 'Escape') setActiveModal(null);
        return;
      }

      if (!examStarted) {
        if (e.key === 'F1') {
          e.preventDefault();
          setActiveModal('help');
        }
        return;
      }

      const key = e.key.toUpperCase();

      // Alternativas A..E ou 1..5
      const mapNum = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E' };
      const selectedLetra = mapNum[key] || (['A', 'B', 'C', 'D', 'E'].includes(key) ? key : null);

      if (selectedLetra) {
        handleSelectAnswer(selectedLetra);
        return;
      }

      // Navegação
      if (e.key === 'ArrowRight' || key === 'N') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || key === 'P') {
        handlePrev();
      } else if (key === 'M' || key === 'F') {
        handleToggleFlag();
      } else if (key === 'G') {
        setShowAnswerInstant(prev => !prev);
      } else if (e.key === 'F1') {
        e.preventDefault();
        setActiveModal('help');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, examStarted, currentIndex, examQuestions, currentQuestion]);

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="win-window bevel-outset" style={{ width: '380px', padding: '16px', textAlign: 'center' }}>
          <div className="win-titlebar" style={{ marginBottom: '14px' }}>
            <span>EstudeAqui - Carregando...</span>
          </div>
          <p style={{ marginBottom: '10px', fontSize: '13px' }}>Carregando 5.799 questões de 112 provas...</p>
          <div className="bevel-inset" style={{ height: '16px', backgroundColor: '#ddd', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '100%', background: 'repeating-linear-gradient(45deg, #444, #444 10px, #888 10px, #888 20px)' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="win-window bevel-outset">
        {/* BARRA DE TÍTULO */}
        <TitleBar
          title={
            examStarted
              ? `EstudeAqui - [${currentExam?.nome || 'Simulado'}] - ${examQuestions.length} Questões`
              : `EstudeAqui - Centro de Simulados & Treinamento [5.799 Questões / 112 Provas]`
          }
          onMinimize={() => alert('Aplicativo em execução.')}
          onMaximize={() => {}}
          onClose={() => { if (confirm('Deseja fechar o EstudeAqui?')) window.close(); }}
        />

        {/* BARRA DE MENUS */}
        <MenuBar
          onOpenExamSelector={() => handleOpenSelector('individual')}
          onResetExam={handleResetCurrentExam}
          onOpenStats={() => setActiveModal('stats')}
          onOpenHelp={() => setActiveModal('help')}
          onFinishExam={() => handleFinishExam(false)}
          theme={theme}
          setTheme={setTheme}
          fontSize={fontSize}
          setFontSize={setFontSize}
          mode={mode}
          setMode={setMode}
        />

        {/* BARRA DE FERRAMENTAS */}
        <Toolbar
          examStarted={examStarted}
          onGoHome={handleGoHome}
          onOpenExamSelector={handleOpenSelector}
          onFinishExam={() => handleFinishExam(false)}
          onOpenStats={() => setActiveModal('stats')}
          onOpenHelp={() => setActiveModal('help')}
          mode={mode}
          setMode={setMode}
          theme={theme}
          setTheme={setTheme}
          fontSize={fontSize}
          setFontSize={setFontSize}
          isTimerStarted={isTimerStarted}
          onStartTimer={handleStartTimer}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(prev => !prev)}
        />

        {/* ÁREA PRINCIPAL */}
        <div className="win-content">
          {!examStarted ? (
            /* TELA INICIAL QUANDO NENHUMA PROVA ESTÁ EM ANDAMENTO */
            <WelcomeScreen
              provasCount={provasList.length}
              questionsCount={allQuestions.length}
              onOpenExamSelector={handleOpenSelector}
              onOpenStats={() => setActiveModal('stats')}
              onOpenHelp={() => setActiveModal('help')}
            />
          ) : (
            /* VISUALIZADOR DA PROVA EM ANDAMENTO + GRADE LATERAL */
            <>
              <QuestionViewer
                question={currentQuestion}
                currentIndex={currentIndex}
                totalQuestions={examQuestions.length}
                selectedAnswer={currentQuestion ? userAnswers[currentQuestion.id] : null}
                onSelectAnswer={handleSelectAnswer}
                isFlagged={currentQuestion ? flaggedSet.has(currentQuestion.id) : false}
                onToggleFlag={handleToggleFlag}
                strikethroughSet={currentQuestion ? strikethroughMap[currentQuestion.id] : null}
                onToggleStrike={handleToggleStrike}
                onPrev={handlePrev}
                onNext={handleNext}
                hasPrev={currentIndex > 0}
                hasNext={currentIndex < examQuestions.length - 1}
                mode={mode}
                showAnswerInstant={showAnswerInstant}
                onCheckAnswer={() => setShowAnswerInstant(prev => !prev)}
              />

              <QuestionGrid
                questions={examQuestions}
                currentIndex={currentIndex}
                onSelectIndex={(idx) => {
                  setCurrentIndex(idx);
                  setShowAnswerInstant(false);
                }}
                userAnswers={userAnswers}
                flaggedSet={flaggedSet}
                timerSeconds={timerSeconds}
                isTimerStarted={isTimerStarted}
                onStartTimer={handleStartTimer}
                isPaused={isPaused}
                onTogglePause={() => setIsPaused(prev => !prev)}
                mode={mode}
              />
            </>
          )}
        </div>

        {/* BARRA DE STATUS INFERIOR */}
        <StatusBar
          currentIndex={examStarted ? currentIndex : 0}
          totalQuestions={examStarted ? examQuestions.length : allQuestions.length}
          currentExamName={examStarted ? currentExam?.nome : 'Pronto para Iniciar'}
          answeredCount={Object.keys(userAnswers).length}
          flaggedCount={flaggedSet.size}
          timerSeconds={timerSeconds}
          mode={mode}
          theme={theme}
        />
      </div>

      {/* MODAL: SELETOR DE PROVA */}
      {activeModal === 'selector' && (
        <ExamSelectorModal
          provasList={provasList}
          allQuestions={allQuestions}
          initialTab={selectorInitialTab}
          onStartExam={handleStartExam}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* MODAL: RESULTADOS / GABARITO */}
      {activeModal === 'results' && (
        <ResultsModal
          results={resultsData}
          onReviewQuestion={(idx) => {
            setCurrentIndex(idx);
            setShowAnswerInstant(true);
          }}
          onNewExam={() => handleOpenSelector('individual')}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* MODAL: HISTÓRICO & ESTATÍSTICAS */}
      {activeModal === 'stats' && (
        <StatsModal
          history={history}
          onClearHistory={() => {
            setHistory([]);
            localStorage.removeItem('estudeaqui_history');
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* MODAL: AJUDA & ATALHOS */}
      {activeModal === 'help' && (
        <HelpModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
