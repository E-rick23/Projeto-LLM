async function enviarParaLLM() {
  const texto = document.getElementById("entrada-requisitos").value;
  const saida = document.getElementById("resposta-llm");

  // Limpa e mostra o carregando
  saida.textContent = "";
  const loadingText = "Analisando requisitos";
  let dots = 0;

  const loadingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    saida.textContent = loadingText + ".".repeat(dots);
  }, 500);

  try {
    const resposta = await fetch("http://localhost:3000/api/validar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: texto })
    });

    const dados = await resposta.json();

    clearInterval(loadingInterval); // Para animação de carregamento
    saida.textContent = ""; // Limpa antes de mostrar resultado

    if (dados.resultado) {
      escreverGradualmente(saida, dados.resultado);
    } else {
      saida.textContent = "Nenhuma resposta recebida.";
    }
  } catch (erro) {
    clearInterval(loadingInterval);
    console.error(erro);
    saida.textContent = "Erro ao conectar ao servidor.";
  }
}

function escreverGradualmente(elemento, texto, velocidade = 15) {
  let index = 0;
  elemento.classList.add("typing"); // Adiciona a classe com cursor

  const intervalo = setInterval(() => {
    if (index < texto.length) {
      elemento.textContent += texto.charAt(index);
      index++;
      elemento.scrollTop = elemento.scrollHeight; // Mantém o scroll no final
    } else {
      clearInterval(intervalo);
      elemento.classList.remove("typing"); // Remove o cursor após digitação
    }
  }, velocidade);
}
