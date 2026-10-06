import json
import sqlite3
import os

data_dir = os.path.abspath('data')
json_path = os.path.join(data_dir, 'questoes_inep.json')
provas_path = os.path.join(data_dir, 'provas_inep.json')
db_path = os.path.join(data_dir, 'questoes_inep.db')

if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Criar tabelas
cur.execute('''
CREATE TABLE provas (
    id INTEGER PRIMARY KEY,
    nome TEXT,
    ano INTEGER,
    dia INTEGER,
    caderno TEXT,
    total_questoes INTEGER,
    link_prova_pdf TEXT,
    link_gabarito_pdf TEXT
)
''')

cur.execute('''
CREATE TABLE questoes (
    id INTEGER PRIMARY KEY,
    prova_id INTEGER,
    ano INTEGER,
    dia INTEGER,
    numero_questao INTEGER,
    materia TEXT,
    area_conhecimento TEXT,
    enunciado TEXT,
    gabarito TEXT,
    observacao TEXT,
    FOREIGN KEY (prova_id) REFERENCES provas(id)
)
''')

cur.execute('''
CREATE TABLE alternativas (
    id INTEGER PRIMARY KEY,
    questao_id INTEGER,
    letra TEXT,
    texto TEXT,
    correta INTEGER,
    FOREIGN KEY (questao_id) REFERENCES questoes(id)
)
''')

cur.execute('''
CREATE TABLE imagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    questao_id INTEGER,
    url TEXT,
    FOREIGN KEY (questao_id) REFERENCES questoes(id)
)
''')

# Inserir provas
with open(provas_path, 'r', encoding='utf-8') as f:
    provas = json.load(f)

for p in provas:
    cur.execute('''
    INSERT INTO provas (id, nome, ano, dia, caderno, total_questoes, link_prova_pdf, link_gabarito_pdf)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (p['codigo'], p['nome'], p['ano'], p['dia'], p['tipoProva'], p['totalQuestoes'], p.get('linkProvaPdf'), p.get('linkGabaritoPdf')))

# Inserir questões e alternativas
with open(json_path, 'r', encoding='utf-8') as f:
    questoes = json.load(f)

for q in questoes:
    cur.execute('''
    INSERT INTO questoes (id, prova_id, ano, dia, numero_questao, materia, area_conhecimento, enunciado, gabarito, observacao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (q['id'], q['provaId'], q['ano'], q['dia'], q['numeroQuestao'], q['materia'], q['areaConhecimento'], q['enunciado'], q['gabarito'], q['observacao']))

    for alt in q['alternativas']:
        cur.execute('''
        INSERT INTO alternativas (id, questao_id, letra, texto, correta)
        VALUES (?, ?, ?, ?, ?)
        ''', (alt['id'], q['id'], alt['letra'], alt['texto'], 1 if alt['correta'] else 0))

    for img_url in q.get('imagens', []):
        cur.execute('''
        INSERT INTO imagens (questao_id, url)
        VALUES (?, ?)
        ''', (q['id'], img_url))

# Criar índices para consultas ultrarrápidas
cur.execute('CREATE INDEX idx_questoes_prova ON questoes(prova_id);')
cur.execute('CREATE INDEX idx_questoes_ano_dia ON questoes(ano, dia);')
cur.execute('CREATE INDEX idx_questoes_area ON questoes(area_conhecimento);')
cur.execute('CREATE INDEX idx_alternativas_questao ON alternativas(questao_id);')

conn.commit()
conn.close()

print(f"SQLite criado com sucesso em: {db_path} ({os.path.getsize(db_path) / 1024 / 1024:.2f} MB)")
