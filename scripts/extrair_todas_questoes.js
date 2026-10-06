import fs from 'fs';
import path from 'path';

const API_BASE = 'https://apisunsale.azurewebsites.net/api';
const DATA_DIR = path.resolve('data');
const PUBLIC_DATA_DIR = path.resolve('public/data');

[DATA_DIR, PUBLIC_DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function obterToken() {
  console.log('Autenticando para obter token com gabaritos completos...');
  try {
    const res = await fetch(`${API_BASE}/Token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'teste_ag_inep_2004313036@estudeaqui.local',
        password: '123456'
      })
    });
    const data = await res.json();
    if (data.token) {
      console.log('Autenticação confirmada!');
      return data.token;
    }
  } catch (err) {
    console.error('Erro na autenticação principal, gerando usuário alternativo...', err.message);
  }

  const novoEmail = `estudante_${Date.now()}@estudeaqui.local`;
  await fetch(`${API_BASE}/Usuarios?perfil=0`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      login: novoEmail,
      nome: 'Estudante EstudeAqui',
      email: novoEmail,
      pass: '123456',
      dataNascimento: '2000-01-01',
      instituicao: 'Vestibulares e Concursos'
    })
  });

  const tokenRes = await fetch(`${API_BASE}/Token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: novoEmail, password: '123456' })
  });
  const tokenData = await tokenRes.json();
  return tokenData.token;
}

function categorizarProva(nomeProva, banca, tipoAssociado = []) {
  const n = (nomeProva || '').toLowerCase();
  const b = (banca || '').toLowerCase();

  if (n.includes('enem') || b.includes('inep') || n.includes('encceja') || n.includes('revalida')) {
    return { categoriaId: 'enem', categoriaNome: 'ENEM / INEP' };
  }

  if (
    n.includes('ita') || n.includes('ufu') || n.includes('iftm') || n.includes('usp') ||
    n.includes('vestibular') || n.includes('técnico') || n.includes('tecnico') ||
    n.includes('cefet') || b.includes('dirps') || b.includes('cefetminas') ||
    b.includes('prograd') || b.includes('ita') || b.includes('usp') ||
    (b.includes('vunesp') && n.includes('vestibular'))
  ) {
    return { categoriaId: 'vestibular', categoriaNome: 'Vestibulares & Institutos' };
  }

  if (n.includes('detran') || b.includes('detran') || n.includes('cnh') || n.includes('habilitação')) {
    return { categoriaId: 'habilitacao', categoriaNome: 'DETRAN & Habilitação' };
  }

  if (
    n.includes('polícia') || n.includes('policia') || n.includes('perito') || n.includes('delegado') ||
    n.includes('trt') || n.includes('concurso') || n.includes('banco da amazônia') ||
    b.includes('fgv') || b.includes('cespe') || b.includes('cesgranrio') || b.includes('fumarc') ||
    b.includes('ibfc') || b.includes('fundatec') || b.includes('vunesp') || b.includes('trt') ||
    n.includes('prefeitura')
  ) {
    return { categoriaId: 'concurso', categoriaNome: 'Concursos Públicos' };
  }

  return { categoriaId: 'outros', categoriaNome: 'Outros Exames' };
}

function padronizarDisciplina(materiaOriginal, enunciado, categoriaId) {
  const m = (materiaOriginal || '').toUpperCase();
  const e = (enunciado || '').toUpperCase();

  if (m.includes('MATEMÁTICA') || m.includes('MATEMATICA') || m.includes('CÁLCULO') || m.includes('CALCULO')) {
    return 'Matemática';
  }
  if (m.includes('RACIOCÍNIO') || m.includes('RACIOCINIO') || m.includes('LÓGICO') || m.includes('LOGICO')) {
    return 'Raciocínio Lógico';
  }
  if (m.includes('FÍSICA') || m.includes('FISICA')) return 'Física';
  if (m.includes('QUÍMICA') || m.includes('QUIMICA')) return 'Química';
  if (m.includes('BIOLOGIA') || m.includes('BIOLÓGICAS')) return 'Biologia';

  if (m.includes('PORTUGUÊS') || m.includes('PORTUGUES') || m.includes('GRAMÁTICA') || m.includes('TEXTO') || m.includes('REDACAO')) {
    return 'Língua Portuguesa';
  }
  if (m.includes('LITERATURA')) return 'Literatura';
  if (m.includes('INGLÊS') || m.includes('INGLES')) return 'Língua Inglesa';
  if (m.includes('ESPANHOL')) return 'Língua Espanhola';

  if (m.includes('HISTÓRIA') || m.includes('HISTORIA')) return 'História';
  if (m.includes('GEOGRAFIA')) return 'Geografia';
  if (m.includes('FILOSOFIA')) return 'Filosofia';
  if (m.includes('SOCIOLOGIA')) return 'Sociologia';

  if (m.includes('DIREITO') || m.includes('LEGISLAÇÃO') || m.includes('LEGISLACAO') || m.includes('CONSTITUCIONAL') || m.includes('PENAL') || m.includes('ADMINISTRATIVO') || m.includes('SUS')) {
    return 'Direito & Legislação';
  }

  if (m.includes('INFORMÁTICA') || m.includes('INFORMATICA') || m.includes('TI') || m.includes('TECNOLOGIA')) {
    return 'Informática';
  }

  if (m.includes('TRÂNSITO') || m.includes('TRANSITO') || m.includes('DIREÇÃO') || m.includes('MECÂNICA') || m.includes('PRIMEIROS SOCORROS') || categoriaId === 'habilitacao') {
    return 'Legislação de Trânsito';
  }

  if (m.includes('CONHECIMENTOS ESPECÍFICOS') || m.includes('CONHECIMENTOS ESPECIFICOS')) {
    return 'Conhecimentos Específicos';
  }

  if (m.includes('LINGUAGENS')) return 'Linguagens & Códigos';
  if (m.includes('HUMANAS')) return 'Ciências Humanas';
  if (m.includes('NATUREZA')) return 'Ciências da Natureza';

  return materiaOriginal || 'Conhecimentos Gerais';
}

function processarEnunciadoEImagens(campoQuestao, anexos) {
  let html = campoQuestao || '';
  const imagens = [];

  if (anexos && Array.isArray(anexos)) {
    for (let i = 0; i < anexos.length; i++) {
      const anexo = anexos[i];
      if (anexo && anexo.link) {
        imagens.push(anexo.link);
        const placeholderRegex = new RegExp(`<img[^>]*id=['"]divAnexo${i}['"][^>]*>`, 'gi');
        if (placeholderRegex.test(html)) {
          html = html.replace(placeholderRegex, `<img src="${anexo.link}" alt="Figura da questão ${i + 1}" class="questao-imagem" />`);
        } else {
          html += `<br><img src="${anexo.link}" alt="Figura da questão ${i + 1}" class="questao-imagem" />`;
        }
      }
    }
  }

  return { html, imagens };
}

function processarAlternativas(respostasQuestoes) {
  if (!respostasQuestoes || !Array.isArray(respostasQuestoes)) {
    return { alternativas: [], gabarito: null };
  }

  const alternativas = respostasQuestoes.map((opt, idx) => {
    const letra = String.fromCharCode(65 + idx);
    let texto = (opt.textoResposta || '')
      .replace(/^[A-E]\)\s*/i, '')
      .replace(/^\s*<br\s*\/?>/gi, '')
      .trim();

    const isCorreta = opt.certa === '1' || opt.certa === 1 || opt.certa === true;

    return {
      id: opt.codigo,
      letra,
      texto,
      correta: isCorreta
    };
  });

  const alternativaCorreta = alternativas.find(a => a.correta);
  const gabarito = alternativaCorreta ? alternativaCorreta.letra : null;

  return { alternativas, gabarito };
}

async function extrairTudo() {
  const token = await obterToken();
  const headers = { Authorization: `Bearer ${token}` };

  console.log('Iniciando extração de TODAS as questões e provas do banco...');

  // 1. Obter todas as provas cadastradas para metadados ricos
  const testsRes = await fetch(`${API_BASE}/PublicQuestoes/GetTests`);
  const testsData = await testsRes.json();
  const mapaProvas = new Map();

  for (const t of testsData.object) {
    const cat = categorizarProva(t.nomeProva, t.banca);
    const anoMatch = (t.nomeProva || '').match(/\b(20\d{2}|19\d{2})\b/);
    const ano = anoMatch ? parseInt(anoMatch[1], 10) : parseInt(t.dataAplicacao, 10) || 0;

    mapaProvas.set(t.codigo, {
      codigo: t.codigo,
      nome: t.nomeProva,
      banca: t.banca || 'Não informada',
      ano,
      tipoProva: t.tipoProva || 'Padrão',
      categoriaId: cat.categoriaId,
      categoriaNome: cat.categoriaNome,
      linkProvaPdf: t.linkProva || '',
      linkGabaritoPdf: t.linkGabarito || '',
      totalQuestoes: 0
    });
  }

  // 2. Paginar todas as questões gerais da API
  let page = 1;
  const pageSize = 100;
  const todasQuestoes = [];
  let totalQuestoesGerais = 0;

  console.log('\nBaixando questões paginadas (100 por página)...');

  while (true) {
    process.stdout.write(`Carregando página ${page}... `);
    const url = `${API_BASE}/Questoes/pagged?page=${page}&quantity=${pageSize}&anexos=true`;
    const res = await fetch(url, { headers });
    const data = await res.json();

    if (!data.success || !data.object || data.object.length === 0) {
      console.log('Fim das páginas.');
      break;
    }

    totalQuestoesGerais = data.total || 0;

    for (const q of data.object) {
      // Registrar ou atualizar dados da prova se vier no objeto da questão
      let infoProva = mapaProvas.get(q.codigoProva);
      if (!infoProva && q.prova) {
        const cat = categorizarProva(q.prova.nomeProva, q.prova.banca);
        const anoMatch = (q.prova.nomeProva || '').match(/\b(20\d{2}|19\d{2})\b/);
        const ano = anoMatch ? parseInt(anoMatch[1], 10) : parseInt(q.prova.dataAplicacao, 10) || 0;
        infoProva = {
          codigo: q.codigoProva,
          nome: q.prova.nomeProva,
          banca: q.prova.banca || 'Não informada',
          ano,
          tipoProva: q.prova.tipoProva || 'Padrão',
          categoriaId: cat.categoriaId,
          categoriaNome: cat.categoriaNome,
          linkProvaPdf: q.prova.linkProva || '',
          linkGabaritoPdf: q.prova.linkGabarito || '',
          totalQuestoes: 0
        };
        mapaProvas.set(q.codigoProva, infoProva);
      }

      const provaNome = infoProva ? infoProva.nome : `Prova #${q.codigoProva}`;
      const banca = infoProva ? infoProva.banca : 'Desconhecida';
      const categoriaId = infoProva ? infoProva.categoriaId : 'outros';
      const categoriaNome = infoProva ? infoProva.categoriaNome : 'Outros Exames';
      const ano = infoProva ? infoProva.ano : 0;

      const { html, imagens } = processarEnunciadoEImagens(q.campoQuestao, q.anexosQuestoes);
      const { alternativas, gabarito } = processarAlternativas(q.respostasQuestoes);
      const disciplina = padronizarDisciplina(q.materia, html, categoriaId);

      const itemFormatado = {
        id: q.Id,
        provaId: q.codigoProva,
        provaNome,
        banca,
        categoriaId,
        categoriaNome,
        ano,
        numeroQuestao: q.numeroQuestao,
        materiaOriginal: q.materia || disciplina,
        disciplina,
        enunciado: html,
        imagens,
        alternativas,
        gabarito,
        observacao: q.observacaoQuestao || ''
      };

      todasQuestoes.push(itemFormatado);
      if (infoProva) infoProva.totalQuestoes++;
    }

    console.log(`Baixadas ${todasQuestoes.length}/${totalQuestoesGerais}`);

    if (todasQuestoes.length >= totalQuestoesGerais || data.object.length < pageSize) {
      break;
    }

    page++;
    await new Promise(r => setTimeout(r, 60)); // Pausa amigável
  }

  // Filtrar provas que realmente têm questões
  const listaProvasFinal = Array.from(mapaProvas.values())
    .filter(p => p.totalQuestoes > 0)
    .sort((a, b) => b.ano - a.ano || a.nome.localeCompare(b.nome));

  console.log(`\n========================================`);
  console.log(`EXTRAÇÃO COMPLETA FINALIZADA!`);
  console.log(`Total de Questões Baixadas: ${todasQuestoes.length}`);
  console.log(`Total de Provas Ativas: ${listaProvasFinal.length}`);
  console.log(`Gabaritos Presentes: ${todasQuestoes.filter(q => q.gabarito !== null).length}`);
  console.log(`========================================\n`);

  // Salvar arquivos na pasta data e public/data
  const arquivos = [
    { dir: DATA_DIR, nomeQuestoes: 'questoes_completo.json', nomeProvas: 'provas_completo.json' },
    { dir: PUBLIC_DATA_DIR, nomeQuestoes: 'questoes_completo.json', nomeProvas: 'provas_completo.json' }
  ];

  for (const arq of arquivos) {
    const pQ = path.join(arq.dir, arq.nomeQuestoes);
    const pP = path.join(arq.dir, arq.nomeProvas);
    fs.writeFileSync(pQ, JSON.stringify(todasQuestoes, null, 2), 'utf-8');
    fs.writeFileSync(pP, JSON.stringify(listaProvasFinal, null, 2), 'utf-8');
    console.log(`Salvo em ${pQ} (${(fs.statSync(pQ).size / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`Salvo em ${pP}`);
  }
}

extrairTudo().catch(err => {
  console.error('Erro na extração total:', err);
  process.exit(1);
});
