
function atualizarTempoData() {
    const tempoElemento = document.getElementById("time");
    const dataElemento = document.getElementById("date");

    const agora = new Date();

    // Hora atual formatada (HH:MM:SS)
    const tempoString = agora.toLocaleTimeString();

    // Data atual formatada (Ex: Segunda-feira, 7 de Dezembro de 2024)
    const dataString = agora.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    tempoElemento.textContent = tempoString;
    dataElemento.textContent = dataString;
}

// Atualizar a hora e a data a cada segundo
setInterval(atualizarTempoData, 1000);
atualizarTempoData();

