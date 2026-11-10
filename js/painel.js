// painel.js — lista, busca e exclusão de produtos

exigirLogin(); // sem login, volta para a tela 1

document.getElementById("nomeUsuario").textContent = usuarioLogado();
document.getElementById("btnSair").addEventListener("click", sair);

const corpoTabela = document.getElementById("corpoTabela");
const campoBusca = document.getElementById("busca");

function mostrarProdutos() {
  const termo = campoBusca.value.toLowerCase();

  // Filtro igual a: WHERE nome LIKE '%termo%'
  const produtos = listarProdutos()
    .filter(p => p.nome.toLowerCase().includes(termo))
    .sort((a, b) => a.nome.localeCompare(b.nome)); // ORDER BY nome

  corpoTabela.innerHTML = "";

  if (produtos.length === 0) {
    corpoTabela.innerHTML = '<tr><td colspan="5">Nenhum produto encontrado.</td></tr>';
  }

  produtos.forEach(function (p) {
    const baixo = p.quantidade < p.estoque_minimo;
    const linha = document.createElement("tr");
    if (baixo) linha.classList.add("baixo");

    linha.innerHTML = `
      <td>${p.nome} ${baixo ? '<span class="selo">Estoque baixo</span>' : ""}</td>
      <td>${nomeCategoria(p.categoria_id)}</td>
      <td>${p.quantidade}</td>
      <td>${formatarPreco(p.preco)}</td>
      <td>
        <a href="produto.html?id=${p.id}" class="btn btn-pequeno">Editar</a>
        <button class="btn btn-pequeno btn-perigo" data-id="${p.id}">Excluir</button>
      </td>
    `;
    corpoTabela.appendChild(linha);
  });

  atualizarResumo();
}

function atualizarResumo() {
  const todos = listarProdutos();
  const itens = todos.reduce((soma, p) => soma + p.quantidade, 0);
  const baixos = todos.filter(p => p.quantidade < p.estoque_minimo).length;

  document.getElementById("totalProdutos").textContent = todos.length;
  document.getElementById("totalItens").textContent = itens;
  document.getElementById("totalBaixo").textContent = baixos;
}

// Um único "ouvinte" na tabela pega o clique de qualquer botão Excluir
corpoTabela.addEventListener("click", function (evento) {
  const id = evento.target.dataset.id;
  if (!id) return;
  if (confirm("Deseja mesmo excluir este produto?")) {
    excluirProduto(Number(id));
    mostrarProdutos();
  }
});

campoBusca.addEventListener("input", mostrarProdutos);

mostrarProdutos();
