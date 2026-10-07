/**
 * Utilitário canônico de classificação, ordenação e bloqueio de questões
 * em conformidade com as diretrizes oficiais do ENEM, Vestibulares e Concursos.
 */

// Mapeamento de disciplinas para blocos gerais
const DISCIPLINA_TO_BLOCK = {
  // Linguagens
  'Língua Portuguesa': { blocoId: 'linguagens', blocoNome: 'Linguagens, Códigos e suas Tecnologias', icone: '📖', ordem: 2 },
  'Literatura': { blocoId: 'linguagens', blocoNome: 'Linguagens, Códigos e suas Tecnologias', icone: '📖', ordem: 2 },
  'Língua Inglesa': { blocoId: 'estrangeira', blocoNome: 'Língua Estrangeira (Inglês / Espanhol)', icone: '🌐', ordem: 1 },
  'Língua Espanhola': { blocoId: 'estrangeira', blocoNome: 'Língua Estrangeira (Inglês / Espanhol)', icone: '🌐', ordem: 1 },

  // Humanas
  'História': { blocoId: 'humanas', blocoNome: 'Ciências Humanas e suas Tecnologias', icone: '🏛️', ordem: 3 },
  'Geografia': { blocoId: 'humanas', blocoNome: 'Ciências Humanas e suas Tecnologias', icone: '🏛️', ordem: 3 },
  'Filosofia': { blocoId: 'humanas', blocoNome: 'Ciências Humanas e suas Tecnologias', icone: '🏛️', ordem: 3 },
  'Sociologia': { blocoId: 'humanas', blocoNome: 'Ciências Humanas e suas Tecnologias', icone: '🏛️', ordem: 3 },
  'Ciências Humanas': { blocoId: 'humanas', blocoNome: 'Ciências Humanas e suas Tecnologias', icone: '🏛️', ordem: 3 },
  'Atualidades': { blocoId: 'humanas', blocoNome: 'Ciências Humanas e Conhecimentos Gerais', icone: '🏛️', ordem: 3 },
  'Conhecimentos Gerais': { blocoId: 'humanas', blocoNome: 'Ciências Humanas e Conhecimentos Gerais', icone: '🏛️', ordem: 3 },

  // Natureza
  'Biologia': { blocoId: 'natureza', blocoNome: 'Ciências da Natureza e suas Tecnologias', icone: '🔬', ordem: 1 },
  'Física': { blocoId: 'natureza', blocoNome: 'Ciências da Natureza e suas Tecnologias', icone: '🔬', ordem: 1 },
  'Química': { blocoId: 'natureza', blocoNome: 'Ciências da Natureza e suas Tecnologias', icone: '🔬', ordem: 1 },
  'Ciências da Natureza': { blocoId: 'natureza', blocoNome: 'Ciências da Natureza e suas Tecnologias', icone: '🔬', ordem: 1 },

  // Matemática
  'Matemática': { blocoId: 'matematica', blocoNome: 'Matemática e suas Tecnologias', icone: '📐', ordem: 2 },
  'Raciocínio Lógico': { blocoId: 'matematica', blocoNome: 'Matemática e Raciocínio Lógico', icone: '📐', ordem: 2 },

  // Conhecimentos Específicos e Legislação
  'Direito & Legislação': { blocoId: 'especificas', blocoNome: 'Conhecimentos Específicos & Legislação', icone: '⚖️', ordem: 4 },
  'Legislação de Trânsito': { blocoId: 'especificas', blocoNome: 'Legislação de Trânsito & Condução', icone: '🚗', ordem: 4 },
  'Informática': { blocoId: 'especificas', blocoNome: 'Tecnologia da Informação & Conhecimentos Específicos', icone: '💻', ordem: 4 },
  'Conhecimentos Específicos': { blocoId: 'especificas', blocoNome: 'Conhecimentos Específicos', icone: '📋', ordem: 4 },
  'Administração & Contabilidade': { blocoId: 'especificas', blocoNome: 'Administração & Contabilidade', icone: '📊', ordem: 4 }
};

/**
 * Classifica uma questão específica dentro de seu bloco de conhecimento oficial.
 */
export function classifyQuestionBlock(question, exam) {
  const isEnem =
    exam?.categoriaId === 'enem' ||
    question.categoriaId === 'enem' ||
    (exam?.nome && exam.nome.toLowerCase().includes('enem')) ||
    (question.provaNome && question.provaNome.toLowerCase().includes('enem'));

  const num = Number(question.numeroQuestao) || 0;
  const examName = (exam?.nome || question.provaNome || '').toLowerCase();
  const isDia1 = exam?.dia === 1 || examName.includes('dia 1');
  const isDia2 = exam?.dia === 2 || examName.includes('dia 2');

  // REGRA RIGOROSA PARA O MODELO DO ENEM
  if (isEnem) {
    if (isDia1 || (!isDia2 && num <= 90)) {
      // 1º Domingo: Focado em linguagens e ciências humanas
      if (num >= 1 && num <= 5) {
        const isIngles = question.disciplina === 'Língua Inglesa' || (question.enunciado && question.enunciado.includes('INGLÊS'));
        return {
          blocoId: 'estrangeira',
          blocoNome: isIngles ? 'Língua Estrangeira (Inglês)' : (question.disciplina === 'Língua Espanhola' ? 'Língua Estrangeira (Espanhol)' : 'Língua Estrangeira (Inglês / Espanhol)'),
          icone: '🌐',
          ordem: 1,
          dia: 1,
          diaNome: '1º Domingo: Linguagens & Humanas'
        };
      }
      if (num >= 6 && num <= 45) {
        return {
          blocoId: 'linguagens',
          blocoNome: 'Linguagens, Códigos e suas Tecnologias',
          icone: '📖',
          ordem: 2,
          dia: 1,
          diaNome: '1º Domingo: Linguagens & Humanas'
        };
      }
      if (num >= 46 && num <= 90) {
        return {
          blocoId: 'humanas',
          blocoNome: 'Ciências Humanas e suas Tecnologias',
          icone: '🏛️',
          ordem: 3,
          dia: 1,
          diaNome: '1º Domingo: Linguagens & Humanas'
        };
      }
    }

    if (isDia2 || num > 90) {
      // 2º Domingo: Focado em ciências da natureza e matemática
      // No ENEM oficial: questões 91 a 135 são Ciências da Natureza; questões 136 a 180 são Matemática.
      if (num >= 91 && num <= 135) {
        return {
          blocoId: 'natureza',
          blocoNome: 'Ciências da Natureza e suas Tecnologias',
          icone: '🔬',
          ordem: 1,
          dia: 2,
          diaNome: '2º Domingo: Exatas & Natureza'
        };
      }
      if (num >= 136) {
        return {
          blocoId: 'matematica',
          blocoNome: 'Matemática e suas Tecnologias',
          icone: '📐',
          ordem: 2,
          dia: 2,
          diaNome: '2º Domingo: Exatas & Natureza'
        };
      }

      // Se porventura a prova Dia 2 vier numerada de 1 a 90:
      if (['Biologia', 'Física', 'Química', 'Ciências da Natureza'].includes(question.disciplina)) {
        return {
          blocoId: 'natureza',
          blocoNome: 'Ciências da Natureza e suas Tecnologias',
          icone: '🔬',
          ordem: 1,
          dia: 2,
          diaNome: '2º Domingo: Exatas & Natureza'
        };
      }
      if (question.disciplina === 'Matemática') {
        return {
          blocoId: 'matematica',
          blocoNome: 'Matemática e suas Tecnologias',
          icone: '📐',
          ordem: 2,
          dia: 2,
          diaNome: '2º Domingo: Exatas & Natureza'
        };
      }
    }
  }

  // REGRA PARA VESTIBULARES E CONCURSOS
  const discInfo = DISCIPLINA_TO_BLOCK[question.disciplina];
  if (discInfo) {
    return {
      blocoId: discInfo.blocoId,
      blocoNome: discInfo.blocoNome,
      icone: discInfo.icone,
      ordem: discInfo.ordem,
      diaNome: exam?.nome || 'Caderno de Questões'
    };
  }

  return {
    blocoId: 'geral',
    blocoNome: 'Conhecimentos Gerais',
    icone: '📄',
    ordem: 99,
    diaNome: exam?.nome || 'Caderno de Questões'
  };
}

/**
 * Enriquece e ordena a lista de questões da prova segundo a ordem oficial de conhecimentos.
 * Trata também a seleção de língua estrangeira (Inglês ou Espanhol) para o ENEM Dia 1.
 *
 * @param {Array} rawQuestions Questões filtradas para a prova
 * @param {Object} exam Objeto da prova atual
 * @param {Object} options Configurações adicionais ({ foreignLang: 'ingles' | 'espanhol' | 'ambas' })
 * @returns {Array} Questões enriquecidas e ordenadas
 */
export function enrichAndOrderQuestions(rawQuestions, exam, options = {}) {
  const isEnem =
    exam?.categoriaId === 'enem' ||
    (exam?.nome && exam.nome.toLowerCase().includes('enem'));
  const examName = (exam?.nome || '').toLowerCase();
  const isDia1 = exam?.dia === 1 || examName.includes('dia 1');

  let list = [...rawQuestions];

  // Filtro de Língua Estrangeira no ENEM Dia 1
  if (isEnem && isDia1) {
    const foreignLang = options.foreignLang || 'ingles'; // Padrão: Inglês (como na inscrição do ENEM)

    if (foreignLang === 'ingles') {
      // Exclui questões 1 a 5 de espanhol
      list = list.filter(q => {
        const num = Number(q.numeroQuestao);
        if (num >= 1 && num <= 5 && q.disciplina === 'Língua Espanhola') {
          return false;
        }
        return true;
      });
    } else if (foreignLang === 'espanhol') {
      // Exclui questões 1 a 5 de inglês
      list = list.filter(q => {
        const num = Number(q.numeroQuestao);
        if (num >= 1 && num <= 5 && q.disciplina === 'Língua Inglesa') {
          return false;
        }
        return true;
      });
    }
    // Se for 'ambas', mantém todas
  }

  // Enriquecer cada questão com metadados do bloco
  const enriched = list.map(q => {
    const block = classifyQuestionBlock(q, exam);
    return {
      ...q,
      blocoId: block.blocoId,
      blocoNome: block.blocoNome,
      blocoIcone: block.icone,
      blocoOrdem: block.ordem,
      diaNome: block.diaNome
    };
  });

  // Ordenar as questões com rigor:
  // Se for ENEM: Ordem estrita do Bloco de Conhecimento (Língua Estrangeira -> Linguagens -> Humanas / Natureza -> Matemática)
  // Se for Vestibular/Concurso: Ordem sequencial oficial do caderno (numeroQuestao)
  enriched.sort((a, b) => {
    if (isEnem) {
      if (a.blocoOrdem !== b.blocoOrdem) {
        return a.blocoOrdem - b.blocoOrdem;
      }
    }

    // Número da questão oficial
    const numA = Number(a.numeroQuestao) || 0;
    const numB = Number(b.numeroQuestao) || 0;
    if (numA !== numB) {
      return numA - numB;
    }

    // Em caso de empate no número (ex: questão 1 de inglês e questão 1 de espanhol no ENEM)
    if (a.disciplina !== b.disciplina) {
      return a.disciplina === 'Língua Inglesa' ? -1 : 1;
    }

    return (a.id || 0) - (b.id || 0);
  });

  return enriched;
}

/**
 * Retorna uma lista consolidada dos blocos presentes em uma prova já enriquecida,
 * com contagem de questões e intervalos de numeração.
 */
export function getExamBlocksSummary(questions) {
  const blocksMap = new Map();

  questions.forEach((q, index) => {
    const id = q.blocoId || 'geral';
    if (!blocksMap.has(id)) {
      blocksMap.set(id, {
        blocoId: id,
        blocoNome: q.blocoNome || 'Geral',
        icone: q.blocoIcone || '📄',
        ordem: q.blocoOrdem || 99,
        questionsCount: 0,
        startIndex: index,
        firstQuestionNum: q.numeroQuestao,
        lastQuestionNum: q.numeroQuestao
      });
    }

    const b = blocksMap.get(id);
    b.questionsCount++;
    b.lastQuestionNum = q.numeroQuestao;
    b.endIndex = index;
  });

  return Array.from(blocksMap.values()).sort((a, b) => a.ordem - b.ordem);
}
