// produto.js — cadastrar (INSERT) e editar (UPDATE)

exigirLogin();

// Preenche o <select> com as categorias
const selectCategoria = document.getElementById("categoria");
CATEGORIAS.forEach(function (c) {
  const opcao = document.createElement("option");
  opcao.value = c.id;
  opcao.textContent = c.nome;
  selectCategoria.appendChild(opcao);
});

// Se a URL tiver ?id=3, estamos editando o produto 3
const parametros = new URLSearchParams(window.location.search);
const idEdicao = Number(parametros.get("id"));

if (idEdicao) {
  const p = buscarProduto(idEdicao);
  if (p) {
    document.getElementById("titulo").textContent = "Editar produto";
    document.getElementById("nome").value = p.nome;
    selectCategoria.value = p.categoria_id;
    document.getElementById("quantidade").value = p.quantidade;
    document.getElementById("minimo").value = p.estoque_minimo;
    document.getElementById("preco").value = p.preco;
  }
}

// Mostra a mensagem de erro de um campo e devolve false
function erro(idCampo, texto) {
  document.getElementById(idCampo).textContent = texto;
  return false;
}

document.getElementById("formProduto").addEventListener("submit", function (evento) {
  evento.preventDefault();

  document.querySelectorAll(".erro").forEach(span => (span.textContent = ""));

  const nome = document.getElementById("nome").value.trim();
  const categoria = selectCategoria.value;
  const quantidade = document.getElementById("quantidade").value;
  const minimo = document.getElementById("minimo").value;
  const preco = document.getElementById("preco").value;

  // Validações (as mesmas regras do NOT NULL do banco)
  let valido = true;
  if (nome.length < 3) valido = erro("erroNome", "O nome precisa ter pelo menos 3 letras.");
  if (categoria === "") valido = erro("erroCategoria", "Escolha uma categoria.");
  if (quantidade === "" || Number(quantidade) < 0) valido = erro("erroQuantidade", "Informe uma quantidade de 0 ou mais.");
  if (minimo === "" || Number(minimo) < 0) valido = erro("erroMinimo", "Informe o estoque mínimo.");
  if (preco === "" || Number(preco) <= 0) valido = erro("erroPreco", "Informe um preço maior que zero.");
  if (!valido) return;

  salvarProduto({
    id: idEdicao || null,
    nome: nome,
    categoria_id: Number(categoria),
    quantidade: Number(quantidade),
    estoque_minimo: Number(minimo),
    preco: Number(preco)
  });

  const mensagem = document.getElementById("mensagem");
  mensagem.textContent = "Produto salvo com sucesso! Voltando ao painel...";
  mensagem.classList.add("ok");
  setTimeout(() => (window.location.href = "painel.html"), 1200);
});
