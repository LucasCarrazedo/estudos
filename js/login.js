// login.js — validação e entrada no sistema

const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", function (evento) {
  evento.preventDefault(); // impede a página de recarregar

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  // Limpa erros antigos
  document.getElementById("erroEmail").textContent = "";
  document.getElementById("erroSenha").textContent = "";
  document.getElementById("erroLogin").textContent = "";

  // Validação dos campos
  let valido = true;
  if (email === "") {
    document.getElementById("erroEmail").textContent = "Informe o e-mail.";
    valido = false;
  } else if (!email.includes("@")) {
    document.getElementById("erroEmail").textContent = "E-mail inválido.";
    valido = false;
  }
  if (senha === "") {
    document.getElementById("erroSenha").textContent = "Informe a senha.";
    valido = false;
  }
  if (!valido) return;

  // Confere usuário e senha
  if (fazerLogin(email, senha)) {
    window.location.href = "painel.html";
  } else {
    document.getElementById("erroLogin").textContent = "E-mail ou senha incorretos.";
  }
});
