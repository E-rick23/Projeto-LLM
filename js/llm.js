async function enviarParaLLM() {
  pararGeracao = false;
  const texto = document.getElementById("entrada-requisitos").value;
  const saida = document.getElementById("resposta-llm");
  saida.textContent = "";
  const loadingText = "Analisando requisitos";
  let dots = 0;

  loadingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    saida.textContent = loadingText + ".".repeat(dots);
  }, 500);

  try {
    const resposta = await fetch("http://localhost:3000/api/validar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: texto, tipo: tipoAtual })  // << enviar tipo aqui
    });

    const dados = await resposta.json();

    clearInterval(loadingInterval);
    saida.textContent = "";

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


//Função da animação de escrita :D
function escreverGradualmente(elemento, textoMarkdown, velocidade = 100) {
  const html = marked.parse(textoMarkdown);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const nodes = Array.from(tempDiv.childNodes); // blocos HTML (parágrafos, listas, etc)
  let index = 0;

  elemento.innerHTML = "";
  elemento.classList.add("typing");
  pararGeracao = false; // resetar flag

  const intervalo = setInterval(() => {
    if (pararGeracao) {
      clearInterval(intervalo);
      elemento.classList.remove("typing");
      return;
    }

    if (index < nodes.length) {
      elemento.appendChild(nodes[index]);
      index++;
      elemento.scrollTop = elemento.scrollHeight;
    } else {
      clearInterval(intervalo);
      elemento.classList.remove("typing");
    }
  }, velocidade);
}



let tipoAtual = "validar"; // Tipo atual da operação
let pararGeracao = false;  // Flag para parar geração
let loadingInterval = null; // Controla a animação de carregamento

document.getElementById("btn-parar").addEventListener("click", () => {
  pararGeracao = true;
  clearInterval(loadingInterval); // Também para o carregamento animado
});

document.getElementById("btn-validar").addEventListener("click", () => {
  tipoAtual = "validar";
  document.getElementById("entrada-requisitos").placeholder = "Cole seus requisitos aqui para validação...";
  document.getElementById("titulo-resposta").textContent = "Validação dos Requisitos";
});

document.getElementById("btn-priorizar").addEventListener("click", () => {
  tipoAtual = "priorizar";
  document.getElementById("entrada-requisitos").placeholder = "Cole seus requisitos aqui para priorização...";
  document.getElementById("titulo-resposta").textContent = "Priorização dos Requisitos";
});
