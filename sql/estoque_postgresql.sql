-- =====================================================
-- Banco de dados do Sistema de Estoque  |  PostgreSQL
-- 1) No pgAdmin ou psql, crie o banco:   CREATE DATABASE estoque;
-- 2) Conecte nele (no psql:  \c estoque ) e rode o resto deste arquivo.
--    (PostgreSQL não tem USE; você troca de banco conectando nele.)
-- =====================================================

DROP TABLE IF EXISTS produto;
DROP TABLE IF EXISTS categoria;
DROP TABLE IF EXISTS usuario;

-- SERIAL = número que aumenta sozinho (no MySQL é AUTO_INCREMENT)
CREATE TABLE usuario (
    id     SERIAL PRIMARY KEY,
    nome   VARCHAR(100) NOT NULL,
    email  VARCHAR(100) NOT NULL UNIQUE,
    senha  VARCHAR(255) NOT NULL
);

CREATE TABLE categoria (
    id    SERIAL PRIMARY KEY,
    nome  VARCHAR(50) NOT NULL
);

CREATE TABLE produto (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(100)  NOT NULL,
    categoria_id    INT           NOT NULL,
    quantidade      INT           NOT NULL DEFAULT 0,
    estoque_minimo  INT           NOT NULL DEFAULT 5,
    preco           NUMERIC(10,2) NOT NULL,
    criado_em       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_produto_categoria
        FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

INSERT INTO usuario (nome, email, senha) VALUES
('Administrador', 'admin@estoque.com', '123456');

INSERT INTO categoria (nome) VALUES
('Ferramentas'), ('Elétrica'), ('Hidráulica'), ('Escritório');

INSERT INTO produto (nome, categoria_id, quantidade, estoque_minimo, preco) VALUES
('Martelo de unha',      1, 25, 5, 39.90),
('Chave de fenda 1/4',   1,  3, 5, 12.50),
('Fio flexível 2,5mm',   2, 40, 10, 189.00),
('Disjuntor 20A',        2,  2, 4, 27.80),
('Cano PVC 25mm',        3, 60, 15, 18.40),
('Resma papel A4',       4,  8, 10, 29.90);

-- =====================================================
-- Consultas que a prova costuma pedir
-- =====================================================

-- 1) Login
SELECT id, nome FROM usuario
WHERE email = 'admin@estoque.com' AND senha = '123456';

-- 2) Produtos com o nome da categoria
SELECT p.id, p.nome, c.nome AS categoria, p.quantidade, p.preco
FROM produto p
INNER JOIN categoria c ON c.id = p.categoria_id
ORDER BY p.nome;

-- 3) Busca por nome (ILIKE ignora maiúsculas/minúsculas; só existe no PostgreSQL)
SELECT * FROM produto WHERE nome ILIKE '%chave%';

-- 4) Abaixo do estoque mínimo
SELECT nome, quantidade, estoque_minimo
FROM produto
WHERE quantidade < estoque_minimo;

-- 5) Resumo por categoria
SELECT c.nome AS categoria,
       COUNT(p.id)                 AS total_produtos,
       SUM(p.quantidade * p.preco) AS valor_estoque
FROM categoria c
LEFT JOIN produto p ON p.categoria_id = c.id
GROUP BY c.nome
ORDER BY valor_estoque DESC NULLS LAST;

-- 6) Editar e excluir
UPDATE produto SET quantidade = quantidade + 10 WHERE id = 2;
DELETE FROM produto WHERE id = 6;
