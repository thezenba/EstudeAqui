import fs from 'fs';
import path from 'path';

const API_BASE = 'https://apisunsale.azurewebsites.net/api';
const DATA_DIR = path.resolve('data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function obterToken() {
  console.log('Autenticando na API para obter token com acesso ao gabarito...');
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
      console.log('Autenticado com sucesso!');
      return data.token;
    }
  } catch (err) {
    console.error('Falha ao autenticar com usuário de teste, tentando registrar novo...', err.message);
  }

  // Fallback: criar novo usuário dinâmico se necessário
  const novoEmail = `estudante_${Date.now()}@estudeaqui.local`;
  const regRes = await fetch(`${API_BASE}/Usuarios?perfil=0`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      login: novoEmail,
      nome: 'Estudante EstudeAqui',
      email: novoEmail,
      pass: '123456',
      dataNascimento: '2000-01-01',
      instituicao: 'INEP'
    })
  });
  await regRes.json();

  const tokenRes = await fetch(`${API_BASE}/Token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: novoEmail, password: '123456' })
  });
  const tokenData = await tokenRes.json();
  return tokenData.token;
}

function classificarAreaConhecimento(materia, numeroQuestao, dia) {
  const m = (materia || '').toUpperCase();
  if (m.includes('MATEMÁTICA') || m.includes('MATEMATICA')) return 'Matemática e suas Tecnologias';
  if (m.includes('FÍSICA') || m.includes('FISICA') || m.includes('QUÍMICA') || m.includes('QUIMICA') || m.includes('BIOLOGIA') || m.includes('NATUREZA')) {
    return 'Ciências da Natureza e suas Tecnologias';
  }
  if (m.includes('HISTÓRIA') || m.includes('HISTORIA') || m.includes('GEOGRAFIA') || m.includes('FILOSOFIA') || m.includes('SOCIOLOGIA') || m.includes('HUMANAS')) {
    return 'Ciências Humanas e suas Tecnologias';
  }
  if (m.includes('PORTUGUÊS') || m.includes('PORTUGUES') || m.includes('LITERATURA') || m.includes('INGLÊS') || m.includes('INGLES') || m.includes('ESPANHOL') || m.includes('ARTES') || m.includes('LINGUAGENS')) {
    return 'Linguagens, Códigos e suas Tecnologias';
  }

  // Padrão oficial do ENEM por dia e numeração:
  if (dia === 1) {
    if (numeroQuestao <= 45) return 'Linguagens, Códigos e suas Tecnologias';
    return 'Ciências Humanas e suas Tecnologias';
  } else if (dia === 2) {
    if (numeroQuestao <= 45) return 'Ciências da Natureza e suas Tecnologias';
    return 'Matemática e suas Tecnologias';
  }

  return materia || 'Conhecimentos Gerais';
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
          // Se não encontrou o placeholder específico pelo id, adiciona a imagem
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
    const letra = String.fromCharCode(65 + idx); // 0 -> A, 1 -> B, etc.
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

async function extrairTodasProvas() {
  const token = await obterToken();
  const headers = { Authorization: `Bearer ${token}` };

  console.log('\nBuscando lista de provas cadastradas...');
  const testsRes = await fetch(`${API_BASE}/PublicQuestoes/GetTests`);
  const testsData = await testsRes.json();

  const inepTests = testsData.object
    .filter(t => {
      const nome = (t.nomeProva || '').toLowerCase();
      const banca = (t.banca || '').toLowerCase();
      return nome.includes('enem') || banca.includes('inep');
    })
    .map(t => {
      const anoMatch = t.nomeProva.match(/\b(20\d{2})\b/);
      const diaMatch = t.nomeProva.match(/dia\s*(\d)/i);
      const ano = anoMatch ? parseInt(anoMatch[1], 10) : parseInt(t.dataAplicacao, 10) || 0;
      const dia = diaMatch ? parseInt(diaMatch[1], 10) : (t.nomeProva.includes('1º') ? 1 : 2);

      return {
        codigo: t.codigo,
        nome: t.nomeProva,
        ano,
        dia,
        tipoProva: t.tipoProva || 'Azul',
        banca: t.banca,
        linkProvaPdf: t.linkProva,
        linkGabaritoPdf: t.linkGabarito
      };
    })
    .sort((a, b) => b.ano - a.ano || a.dia - b.dia);

  console.log(`Encontradas ${inepTests.length} provas oficiais do INEP/ENEM.\n`);

  const todasQuestoes = [];
  const resumoProvas = [];

  for (let idx = 0; idx < inepTests.length; idx++) {
    const prova = inepTests[idx];
    console.log(`[${idx + 1}/${inepTests.length}] Baixando ${prova.nome} (Código ${prova.codigo}, Ano ${prova.ano}, Dia ${prova.dia})...`);

    let page = 1;
    let totalQuestoesProva = 0;
    const questoesDestaProva = [];

    while (true) {
      const url = `${API_BASE}/Questoes/pagged?page=${page}&quantity=100&anexos=true&codigoProva=${prova.codigo}`;
      const res = await fetch(url, { headers });
      const data = await res.json();

      if (!data.success || !data.object || data.object.length === 0) {
        break;
      }

      for (const q of data.object) {
        const { html, imagens } = processarEnunciadoEImagens(q.campoQuestao, q.anexosQuestoes);
        const { alternativas, gabarito } = processarAlternativas(q.respostasQuestoes);
        const areaConhecimento = classificarAreaConhecimento(q.materia, q.numeroQuestao, prova.dia);

        const questaoFormatada = {
          id: q.Id,
          provaId: prova.codigo,
          provaNome: prova.nome,
          ano: prova.ano,
          dia: prova.dia,
          numeroQuestao: q.numeroQuestao,
          materia: q.materia || areaConhecimento,
          areaConhecimento,
          enunciado: html,
          imagens,
          alternativas,
          gabarito,
          observacao: q.observacaoQuestao || ''
        };

        questoesDestaProva.push(questaoFormatada);
        todasQuestoes.push(questaoFormatada);
      }

      totalQuestoesProva = data.total || questoesDestaProva.length;
      if (questoesDestaProva.length >= totalQuestoesProva || data.object.length < 100) {
        break;
      }
      page++;
    }

    // Ordenar questões pelo número oficial
    questoesDestaProva.sort((a, b) => a.numeroQuestao - b.numeroQuestao);

    const gabaritosDefinidos = questoesDestaProva.filter(q => q.gabarito !== null).length;
    console.log(`   -> ${questoesDestaProva.length} questões extraídas (${gabaritosDefinidos} gabaritos confirmados)`);

    resumoProvas.push({
      ...prova,
      totalQuestoes: questoesDestaProva.length,
      gabaritosConfirmados: gabaritosDefinidos
    });

    // Pequena pausa amigável entre requisições
    await new Promise(r => setTimeout(r, 100));
  }

  // Ordenar banco geral por ano desc, dia asc, numeroQuestao asc
  todasQuestoes.sort((a, b) => {
    if (b.ano !== a.ano) return b.ano - a.ano;
    if (a.dia !== b.dia) return a.dia - b.dia;
    return a.numeroQuestao - b.numeroQuestao;
  });

  console.log(`\n========================================`);
  console.log(`EXTRAÇÃO CONCLUÍDA COM SUCESSO!`);
  console.log(`Total de Provas: ${resumoProvas.length}`);
  console.log(`Total de Questões Salvas: ${todasQuestoes.length}`);
  console.log(`Total com Gabarito: ${todasQuestoes.filter(q => q.gabarito !== null).length}`);
  console.log(`========================================\n`);

  // Salvar arquivos JSON
  const questoesPath = path.join(DATA_DIR, 'questoes_inep.json');
  const provasPath = path.join(DATA_DIR, 'provas_inep.json');

  fs.writeFileSync(questoesPath, JSON.stringify(todasQuestoes, null, 2), 'utf-8');
  fs.writeFileSync(provasPath, JSON.stringify(resumoProvas, null, 2), 'utf-8');

  console.log(`Arquivo salvo: ${questoesPath} (${(fs.statSync(questoesPath).size / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`Arquivo salvo: ${provasPath}`);
}

extrairTodasProvas().catch(err => {
  console.error('Erro na extração:', err);
  process.exit(1);
});
