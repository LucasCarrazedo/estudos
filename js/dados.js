// =====================================================
// dados.js — "banco de dados" do site usando localStorage.
// Imita as tabelas do script SQL (usuario, categoria, produto).
// Todas as telas carregam este arquivo antes do seu próprio JS.
// =====================================================

// Tabelas fixas (iguais aos INSERTs do script SQL)
const USUARIOS = [
  { id: 1, nome: "Administrador", email: "admin@estoque.com", senha: "123456" }
];

const CATEGORIAS = [
  { id: 1, nome: "Ferramentas" },
  { id: 2, nome: "Elétrica" },
  { id: 3, nome: "Hidráulica" },
  { id: 4, nome: "Escritório" }
];

const PRODUTOS_INICIAIS = [
  { id: 1, nome: "Martelo de unha",    categoria_id: 1, quantidade: 25, estoque_minimo: 5,  preco: 39.9 },
  { id: 2, nome: "Chave de fenda 1/4", categoria_id: 1, quantidade: 3,  estoque_minimo: 5,  preco: 12.5 },
  { id: 3, nome: "Fio flexível 2,5mm", categoria_id: 2, quantidade: 40, estoque_minimo: 10, preco: 189 },
  { id: 4, nome: "Disjuntor 20A",      categoria_id: 2, quantidade: 2,  estoque_minimo: 4,  preco: 27.8 },
  { id: 5, nome: "Cano PVC 25mm",      categoria_id: 3, quantidade: 60, estoque_minimo: 15, preco: 18.4 },
  { id: 6, nome: "Resma papel A4",     categoria_id: 4, quantidade: 8,  estoque_minimo: 10, preco: 29.9 }
];

// ---------- PRODUTOS (o "CRUD") ----------

// SELECT * FROM produto
function listarProdutos() {
  const texto = localStorage.getItem("produtos");
  if (texto === null) {
    // Primeira vez: grava os produtos iniciais
    localStorage.setItem("produtos", JSON.stringify(PRODUTOS_INICIAIS));
    return PRODUTOS_INICIAIS;
  }
  return JSON.parse(texto);
}

// SELECT * FROM produto WHERE id = ?
function buscarProduto(id) {
  return listarProdutos().find(p => p.id === id);
}

// INSERT (sem id) ou UPDATE (com id)
function salvarProduto(produto) {
  const produtos = listarProdutos();
  if (produto.id) {
    const posicao = produtos.findIndex(p => p.id === produto.id);
    produtos[posicao] = produto;
  } else {
    // Imita o AUTO_INCREMENT: maior id + 1
    const maiorId = produtos.reduce((maior, p) => Math.max(maior, p.id), 0);
    produto.id = maiorId + 1;
    produtos.push(produto);
  }
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

// DELETE FROM produto WHERE id = ?
function excluirProduto(id) {
  const produtos = listarProdutos().filter(p => p.id !== id);
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

// Parecido com um JOIN: devolve o nome da categoria
function nomeCategoria(id) {
  const categoria = CATEGORIAS.find(c => c.id === id);
  return categoria ? categoria.nome : "-";
}

// ---------- LOGIN / SESSÃO ----------

// SELECT * FROM usuario WHERE email = ? AND senha = ?
function fazerLogin(email, senha) {
  const usuario = USUARIOS.find(u => u.email === email && u.senha === senha);
  if (usuario) {
    sessionStorage.setItem("usuarioLogado", usuario.nome);
    return true;
  }
  return false;
}

function usuarioLogado() {
  return sessionStorage.getItem("usuarioLogado");
}

// Coloque no começo das telas protegidas
function exigirLogin() {
  if (!usuarioLogado()) {
    window.location.href = "index.html";
  }
}

function sair() {
  sessionStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

// Formata 39.9 -> "R$ 39,90"
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
