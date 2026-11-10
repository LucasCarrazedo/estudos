-- =====================================================
-- Banco de dados do Sistema de Estoque  |  MySQL
-- Rodar no MySQL Workbench ou no terminal:  mysql -u root -p < estoque_mysql.sql
-- =====================================================

DROP DATABASE IF EXISTS estoque;
CREATE DATABASE estoque;
USE estoque;

-- Tabela de usuários (quem faz login)
CREATE TABLE usuario (
    id     INT AUTO_INCREMENT PRIMARY KEY,
    nome   VARCHAR(100) NOT NULL,
    email  VARCHAR(100) NOT NULL UNIQUE,
    senha  VARCHAR(255) NOT NULL
);

-- Tabela de categorias
CREATE TABLE categoria (
    id    INT AUTO_INCREMENT PRIMARY KEY,
    nome  VARCHAR(50) NOT NULL
);

-- Tabela de produtos (1 categoria tem N produtos)
CREATE TABLE produto (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(100)  NOT NULL,
    categoria_id    INT           NOT NULL,
    quantidade      INT           NOT NULL DEFAULT 0,
    estoque_minimo  INT           NOT NULL DEFAULT 5,
    preco           DECIMAL(10,2) NOT NULL,
    criado_em       DATETIME      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_produto_categoria
        FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

-- Dados iniciais
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

-- 1) Login: existe usuário com esse e-mail e senha?
SELECT id, nome FROM usuario
WHERE email = 'admin@estoque.com' AND senha = '123456';

-- 2) Listar produtos com o nome da categoria (JOIN), em ordem alfabética
SELECT p.id, p.nome, c.nome AS categoria, p.quantidade, p.preco
FROM produto p
INNER JOIN categoria c ON c.id = p.categoria_id
ORDER BY p.nome;

-- 3) Buscar produto pelo nome
SELECT * FROM produto WHERE nome LIKE '%chave%';

-- 4) Produtos abaixo do estoque mínimo (alerta)
SELECT nome, quantidade, estoque_minimo
FROM produto
WHERE quantidade < estoque_minimo;

-- 5) Quantidade de produtos e valor em estoque por categoria
SELECT c.nome AS categoria,
       COUNT(p.id)                 AS total_produtos,
       SUM(p.quantidade * p.preco) AS valor_estoque
FROM categoria c
LEFT JOIN produto p ON p.categoria_id = c.id
GROUP BY c.nome
ORDER BY valor_estoque DESC;

-- 6) Editar e excluir
UPDATE produto SET quantidade = quantidade + 10 WHERE id = 2;
DELETE FROM produto WHERE id = 6;
