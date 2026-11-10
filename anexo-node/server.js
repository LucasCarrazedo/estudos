// server.js — liga o site ao MySQL de verdade
// Instalar:  npm init -y   e   npm install express mysql2
// Rodar:     node server.js   e abrir http://localhost:3000
const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());           // entende JSON enviado pelo fetch
app.use(express.static("public")); // serve os .html, .css e .js da pasta public

const banco = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",   // a senha do MySQL da sua máquina
  database: "estoque"
});

// LOGIN
app.post("/api/login", (req, res) => {
  const sql = "SELECT id, nome FROM usuario WHERE email = ? AND senha = ?";
  banco.query(sql, [req.body.email, req.body.senha], (erro, linhas) => {
    if (erro) return res.status(500).json(erro);
    if (linhas.length === 0) return res.status(401).json({ msg: "Login inválido" });
    res.json(linhas[0]);
  });
});

// LISTAR
app.get("/api/produtos", (req, res) => {
  const sql = `SELECT p.*, c.nome AS categoria
               FROM produto p JOIN categoria c ON c.id = p.categoria_id
               ORDER BY p.nome`;
  banco.query(sql, (erro, linhas) => {
    if (erro) return res.status(500).json(erro);
    res.json(linhas);
  });
});

// CADASTRAR
app.post("/api/produtos", (req, res) => {
  const p = req.body;
  const sql = `INSERT INTO produto (nome, categoria_id, quantidade, estoque_minimo, preco)
               VALUES (?, ?, ?, ?, ?)`;
  banco.query(sql, [p.nome, p.categoria_id, p.quantidade, p.estoque_minimo, p.preco], (erro, r) => {
    if (erro) return res.status(500).json(erro);
    res.json({ id: r.insertId });
  });
});

// EXCLUIR
app.delete("/api/produtos/:id", (req, res) => {
  banco.query("DELETE FROM produto WHERE id = ?", [req.params.id], (erro) => {
    if (erro) return res.status(500).json(erro);
    res.json({ ok: true });
  });
});

app.listen(3000, () => console.log("Rodando em http://localhost:3000"));
