const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos
const dataPath = path.join(__dirname, '..', 'data', 'questoes_completo.json');
const publicPath = path.join(__dirname, '..', 'public', 'data', 'questoes_completo.json');
const distPath = path.join(__dirname, '..', 'dist', 'data', 'questoes_completo.json');

console.log('Lendo base de questoes...');
const questoes = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
console.log('Total de questoes:', questoes.length);

// Dicionarios aprimorados para classificacao tematica
const GEO_REGEX = /\b(mapa|mapas|relevo|bioma|biomas|cerrado|caatinga|amazônia|amazonia|pantanal|pampa|mata atlântica|mata atlantica|hidrograf|bacia|bacias|clima|climátic|climático|pluvial|latitude|longitude|cartograf|cartografia|erosão|erosao|solo|solos|tectônic|tectônica|urbanizaç|urbanização|metrópole|metropole|conurbaç|conurbação|migraç|migração|imigraç|imigração|demograf|demografia|pirâmide etária|agronegócio|agronegocio|latifúndio|latifundio|fronteira agrícola|êxodo rural|toyotismo|fordismo|taylorismo|geopolític|geopolítica|aquífero|aquifero|desmatamento|matriz energética|hidrelétrica|hidreletrica|eólica|eolica|vegetação|vegetacao|sedimentar|rochas|intemperismo|geográfico|geografia|populacional|mananciais|assoreamento|lixiviação|deserto|desertificaç|desertificação|ecossistema|ambientais|degradação ambiental|território|territorial|fronteiras|placas|vulcanismo|atmosfera|camada de ozônio|efeito estufa|aquecimento global|meio ambiente|setor primário|setor secundário|setor terciário|fecundidade|densidade demográfica|rural|campo|favela|periferia|sustentável|sustentabilidade|recursos hídricos|mineração|garimpo|commodities|soja|cana-de-açúcar|pecuária|agrícola|agricola|industrialização|globalização|china|blocos econômicos|mercosul|divisão internacional do trabalho)\b/i;

const HIST_REGEX = /\b(século|seculo|séculos|colônia|colonial|capitanias|império|imperial|regência|regencia|d\. pedro|escravid|escravidão|escravizad|escravizados|senzala|quilombo|quilombola|abolição|abolicionista|tráfico negreiro|república velha|coronelismo|getúlio|vargas|ditadura militar|golpe de 1964|constituinte|revolução francesa|feudal|idade média|idade media|renascimento|grécia|grecia|atenas|esparta|roma antiga|romano|romanos|guerra mundial|guerra fria|nazis|nazismo|fascis|fascismo|mercantilismo|grandes navegações|asteca|inca|maia|revolução industrial|revolução russa|monarquia|república|republica|independência do brasil|era vargas|juscelino|jk|constituição de 1988|constituição de 1937|constituição de 1824|trabalhismo|sindicalismo|antiguidade|feudalismo|cruzadas|reforma protestante|luteranismo|absolutismo|luís xiv|independência dos eua|guerra civil|antigo regime|inconfidência mineira|canudos|contestado|revolta da vacina|revolta da chibata|tenentismo|milagre econômico|diretas já|redemocratização|indígenas|indios|jesuítas|caminha|gândavo|clero|nobreza|servos|vassalos|suzerania)\b/i;

const FILO_REGEX = /\b(filosof|filósofo|filosofia|aristóteles|aristoteles|platão|platao|sócrates|socrates|kant|descartes|maquiavel|nietzsche|spinoza|locke|hobbes|rousseau|hegel|habermas|sartre|foucault|metafísica|metafisica|epistemolog|epistemologia|empirismo|racionalismo|imperativo categórico|mito da caverna|maiêutica|silogismo|eudaimonia|ontolog|ontologia|ética|moral|virtude|senso comum|estética|estetica|juízo|juizo|razão pura|razão prática|dualismo|idealismo|ética a nicômaco|leviatã|o príncipe|contrato social|logos|sofistas)\b/i;

const SOCIO_REGEX = /\b(sociolog|sociólogo|sociologia|durkheim|karl marx|max weber|anomia|fato social|ação social|acao social|mais-valia|alienação|alienacao|luta de classes|burguesia|proletariado|estratificação|movimentos sociais|cidadania|patriarcado|etnocentr|etnocentrismo|relativismo cultural|bourdieu|habitus|bauman|modernidade líquida|indústria cultural|adorno|horkheimer|desigualdade social|papéis sociais|instituições sociais|solidariedade mecânica|solidariedade orgânica|capitalismo contemporâneo|preconceito|discriminação|raça|etnia|gênero|feminismo|relações de poder|trabalho e sociedade)\b/i;

const BIO_REGEX = /\b(célula|celula|células|celular|dna|rna|gene|genes|genética|genetica|cromossomo|hereditariedade|alelo|mutação|proteína|proteina|enzima|mitocôndria|ribossomo|cloroplasto|fotossíntese|fotossintese|respiração celular|ecologia|cadeia alimentar|teia alimentar|ecossistema|nicho|habitat|biodiversidade|espécie|especie|espécies|população|comunidade|simbiose|parasita|parasitismo|mutualismo|predatismo|evolução|evolucao|seleção natural|darwin|lamarck|vírus|virus|bactéria|bacteria|bactérias|fungo|fungos|protozoário|protozoarios|doença|doencas|vacina|imunização|soro|anticorpo|anticorpos|linfócito|sistema imunológico|sangue|hemácia|coração|pulmão|rim|fígado|neurônio|sistema nervoso|hormônio|endócrino|reprodução|gameta|espermatozoide|óvulo|meiose|mitose|embrião|botânica|planta|plantas|vegetal|caule|raiz|folha|angiosperma|gimnosperma|animal|invertebrado|vertebrado|mamífero|ave|réptil|anfíbio|peixe|artrópode|inseto|biomassa|ciclo do nitrogênio|ciclo do carbono|eutrofização|bioacumulação|organismo|fisiologia|tecido epitelial)\b/i;

const FIS_REGEX = /\b(velocidade|aceleração|aceleracao|movimento|mru|mruv|trajetória|força|forcas|newton|leis de newton|atrito|gravidade|gravitacional|peso|massa|inércia|trabalho|energia cinética|energia potencial|energia mecânica|conservação da energia|potência|potencia|watts|joules|impulso|colisão|hidrostática|pressão|pressao|densidade|empuxo|arquimedes|pascal|temperatura|calor|calorimetria|caloria|capacidade térmica|calor específico|mudança de fase|fusão|ebulição|condução|convecção|irradiação|termodinâmica|gás ideal|óptica|optica|luz|raio|reflexão|refração|espelho|lente|lentes|foco|distância focal|onda|ondas|frequência|frequencia|comprimento de onda|hertz|período|amplitude|som|acústica|efeito doppler|interferência|difração|polarização|eletrostática|carga elétrica|coulomb|campo elétrico|potencial elétrico|volts|eletrodinâmica|circuito|corrente elétrica|ampere|tensão|tensao|resistência|resistor|ohm|lei de ohm|efeito joule|gerador|magnetismo|campo magnético|ímã|ima|indução|faraday|eletromagnetismo|transformador|cinemática|órbita|vetor|vetorial)\b/i;

const QUIM_REGEX = /\b(química|quimica|químico|quimico|química orgânica|inorgânica|átomo|atomo|átomos|próton|elétron|eletron|nêutron|núcleo|camada|tabela periódica|elemento|família|período|metal|não-metal|ligação química|ligação iônica|ligação covalente|ligação metálica|ligação de hidrogênio|forças intermoleculares|mol|mols|massa molar|estequiometria|reação química|reagente|produto|balanceamento|oxidação|redução|nox|oxirredução|ácido|acido|base|sal|óxido|oxido|ph|poh|acidez|basicidade|indicador|neutralização|solução|solucoes|soluto|solvente|concentração|molaridade|solubilidade|saturada|titulação|termoquímica|entalpia|endotérmica|exotérmica|cinética química|velocidade da reação|catalisador|energia de ativação|equilíbrio químico|le chatelier|eletroquímica|pilha|eletrólise|ânodo|cátodo|carbono|hidrocarboneto|alcano|alceno|alcino|aromático|benzeno|álcool|aldeído|cetona|ácido carboxílico|éster|éter|amina|amida|polímero|plástico|isomería|isômero|destilação|petróleo|combustível|combustão|biocombustível|etanol|soluções aquosas)\b/i;

const LIT_REGEX = /\b(literatura|literário|poema|poesia|poeta|estrofe|verso|versos|machado de assis|drummond|clarice lispector|guimarães rosa|graciliano ramos|manuel bandeira|olavo bilac|álvares de azevedo|castro alves|josé de alencar|romantismo|realismo|naturalismo|parnasianismo|simbolismo|modernismo|modernista|vanguardas|antropofagia|semana de arte moderna|barroco|arcadismo|trovadorismo|romance|conto|crônica|enredo|figura de linguagem|metáfora|metonímia|antítese|ironia|soneto|lírico|eu lírico)\b/i;

const ENG_REGEX = /\b(the|and|of|to|in|is|you|that|it|he|was|for|on|are|as|with|his|they|at|be|this|have|from|or|one|had|by|word|but|not|what|all|were|we|when|your|can|said|there|use|an|each|which|she|do|how|their|if|will|up|other|about|out|many|then|them|these|so|some|her|would|make|like|him|into|time|has|look|two|more|write|go|see|number|no|way|could|people|my|than|first|water|been|call|who|oil|its|now|find|long|down|day|did|get|come|made|may|part|english|text)\b/gi;

const ESP_REGEX = /\b(del|los|las|unos|unas|tras|hacia|hasta|desde|pero|sino|quien|cuyo|aquel|aquella|aquellos|aquellas|usted|vosotros|ellos|ellas|ustedes|nuestro|vuestro|todavía|jamás|tampoco|español|lengua española|según|texto)\b/gi;

function countMatches(str, regex) {
  const m = str.match(regex);
  return m ? m.length : 0;
}

function classificarDisciplina(item) {
  const mOrig = (item.materiaOriginal || '').trim().toUpperCase();
  const cat = item.categoriaId || '';
  const text = ((item.enunciado || '') + ' ' + (Array.isArray(item.alternativas) ? item.alternativas.map(a => a.texto || '').join(' ') : '')).toLowerCase();

  // 1. Trânsito / DETRAN
  if (cat === 'habilitacao' || mOrig.includes('DETRAN') || mOrig.includes('TRÂNSITO') || mOrig.includes('TRANSITO')) {
    return 'Legislação de Trânsito';
  }

  // 2. Matemática e Raciocínio Lógico
  if (mOrig.includes('MATEMÁTICA') || mOrig.includes('MATEMATICA') || mOrig.includes('ESTATÍSTICA') || mOrig.includes('CÁLCULO') || mOrig.includes('CALCULO')) {
    return 'Matemática';
  }
  if (mOrig.includes('RACIOCÍNIO') || mOrig.includes('RACIOCINIO') || mOrig === 'LÓGICA') {
    return 'Raciocínio Lógico';
  }

  // 3. ENEM: Ciências Humanas e suas Tecnologias
  if (mOrig.includes('CIÊNCIAS HUMANAS') || mOrig.includes('CIENCIAS HUMANAS')) {
    const g = countMatches(text, GEO_REGEX);
    const h = countMatches(text, HIST_REGEX);
    const f = countMatches(text, FILO_REGEX);
    const s = countMatches(text, SOCIO_REGEX);

    const max = Math.max(g, h, f, s);
    if (max >= 2) {
      if (g === max) return 'Geografia';
      if (h === max) return 'História';
      if (f === max) return 'Filosofia';
      if (s === max) return 'Sociologia';
    }
    return 'Ciências Humanas';
  }

  // 4. ENEM: Ciências da Natureza e suas Tecnologias
  if (mOrig.includes('CIÊNCIAS DA NATUREZA') || mOrig.includes('CIENCIAS DA NATUREZA')) {
    const b = countMatches(text, BIO_REGEX);
    const f = countMatches(text, FIS_REGEX);
    const qScore = countMatches(text, QUIM_REGEX);

    const max = Math.max(b, f, qScore);
    if (max >= 2) {
      if (b === max) return 'Biologia';
      if (f === max) return 'Física';
      if (qScore === max) return 'Química';
    }
    return 'Ciências da Natureza';
  }

  // 5. ENEM: Linguagens, Códigos e suas Tecnologias
  if (mOrig.includes('LINGUAGENS')) {
    const eng = countMatches(text, ENG_REGEX);
    const esp = countMatches(text, ESP_REGEX);
    const lit = countMatches(text, LIT_REGEX);

    if (eng >= 10) return 'Língua Inglesa';
    if (esp >= 5) return 'Língua Espanhola';
    if (lit >= 2) return 'Literatura';
    return 'Língua Portuguesa';
  }

  // 6. Disciplinas Específicas Diretas
  if (mOrig.includes('HISTÓRIA') || mOrig.includes('HISTORIA')) return 'História';
  if (mOrig.includes('GEOGRAFIA')) return 'Geografia';
  if (mOrig.includes('FILOSOFIA')) return 'Filosofia';
  if (mOrig.includes('SOCIOLOGIA')) return 'Sociologia';
  if (mOrig.includes('LITERATURA')) return 'Literatura';
  if (mOrig.includes('BIOLOGIA') || mOrig === 'BIOLOGIA') return 'Biologia';
  if (mOrig.includes('FÍSICA') || mOrig.includes('FISICA')) return 'Física';
  if (mOrig.includes('QUÍMICA') || mOrig.includes('QUIMICA') || mOrig === 'QUÍMICO') return 'Química';
  if (mOrig.includes('PORTUGUÊS') || mOrig.includes('PORTUGUES') || mOrig.includes('LÍNGUA PORTUGUESA') || mOrig.includes('LINGUA PORTUGUESA')) return 'Língua Portuguesa';
  if (mOrig.includes('INGLÊS') || mOrig.includes('INGLES')) return 'Língua Inglesa';
  if (mOrig.includes('ESPANHOL')) return 'Língua Espanhola';

  // 7. Informática (SOMENTE TI Real!)
  if (
    mOrig === 'INFORMÁTICA' ||
    mOrig.includes('COMPUTAÇÃO') ||
    mOrig.includes('COMPUTACAO') ||
    mOrig.includes('OUTSYSTEMS') ||
    mOrig.includes('PROGRAMADOR') ||
    mOrig.includes('SISTEMAS') ||
    mOrig.includes('TECNOLOGIA DA INFORMAÇÃO') ||
    mOrig.includes('TECNOLOGIA DE COMPUTAÇÃO')
  ) {
    return 'Informática';
  }

  // 8. Direito & Legislação
  if (mOrig.includes('DIREITO') || mOrig.includes('LEGISLAÇÃO') || mOrig.includes('LEGISLACAO') || mOrig.includes('RACIAL') || mOrig.includes('SUS')) {
    return 'Direito & Legislação';
  }

  // 9. Administração & Contabilidade
  if (mOrig.includes('ADMINISTRAÇÃO') || mOrig.includes('CONTABILIDADE')) {
    return 'Administração & Contabilidade';
  }

  // 10. Atualidades
  if (mOrig.includes('ATUALIDADES')) return 'Atualidades';

  // 11. Conhecimentos Específicos
  if (mOrig.includes('CONHECIMENTO') || mOrig.includes('ESPECÍFICO') || mOrig.includes('ESPECIFICO')) {
    return 'Conhecimentos Específicos';
  }

  // 12. Fallback inteligente por texto (para FUVEST 2023 com '?' ou 'CIÊNCIAS')
  const bioScore = countMatches(text, BIO_REGEX);
  const fisScore = countMatches(text, FIS_REGEX);
  const quimScore = countMatches(text, QUIM_REGEX);
  const matScore = countMatches(text, /\b(número|equação|função|triângulo|área|volume|probabilidade|porcentagem|matriz|cartesiano|geometria|trigonometria)\b/gi);
  const histScore = countMatches(text, HIST_REGEX);
  const geoScore = countMatches(text, GEO_REGEX);
  const portScore = countMatches(text, /\b(texto|autor|poema|crônica|linguagem|sentido|palavra|narrador|enunciado)\b/gi);

  const maxScore = Math.max(bioScore, fisScore, quimScore, matScore, histScore, geoScore, portScore);
  if (maxScore >= 2) {
    if (matScore === maxScore) return 'Matemática';
    if (bioScore === maxScore) return 'Biologia';
    if (fisScore === maxScore) return 'Física';
    if (quimScore === maxScore) return 'Química';
    if (histScore === maxScore) return 'História';
    if (geoScore === maxScore) return 'Geografia';
    if (portScore === maxScore) return 'Língua Portuguesa';
  }

  return 'Conhecimentos Gerais';
}

// Aplicar em todas as questões
let reclassifiedCount = 0;
const distribution = {};

questoes.forEach(q => {
  const oldDisc = q.disciplina;
  const newDisc = classificarDisciplina(q);

  if (oldDisc !== newDisc) {
    reclassifiedCount++;
  }

  q.disciplina = newDisc;
  distribution[newDisc] = (distribution[newDisc] || 0) + 1;
});

console.log('Total de questoes com disciplina corrigida:', reclassifiedCount);
console.log('Distribuicao final por disciplina:');
console.log(distribution);

// Salvar no data/questoes_completo.json
fs.writeFileSync(dataPath, JSON.stringify(questoes, null, 2), 'utf8');
console.log('Salvo em:', dataPath);

// Salvar no public/data/questoes_completo.json
fs.writeFileSync(publicPath, JSON.stringify(questoes, null, 2), 'utf8');
console.log('Salvo em:', publicPath);

// Salvar no dist/data/questoes_completo.json se existir
if (fs.existsSync(distPath)) {
  fs.writeFileSync(distPath, JSON.stringify(questoes, null, 2), 'utf8');
  console.log('Salvo em:', distPath);
}

// Verificar especificamente a Questao 1 do ENEM 2015 Dia 1 mencionada pelo usuario:
const q1 = questoes.find(x => x.enunciado && x.enunciado.includes('No mapa estão representados os biomas brasileiros'));
console.log('\n--- VERIFICACAO DA QUESTAO CITADA PELO USUARIO ---');
console.log('ID:', q1.id);
console.log('Prova:', q1.provaNome);
console.log('Questao:', q1.numeroQuestao);
console.log('Materia Original:', q1.materiaOriginal);
console.log('NOVA DISCIPLINA (TAG):', q1.disciplina);
console.log('--------------------------------------------------');
