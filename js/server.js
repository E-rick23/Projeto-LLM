require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


app.post("/api/validar", async (req, res) => {
  const { texto, tipo } = req.body;

  // Prompt base comum
  const basePrompt = `
Você é um especialista em Engenharia de Requisitos.
Considere o seguinte conjunto de requisitos fornecido pelo usuário:
`;

  let prompt = "";

  if (tipo === "priorizar") {
    prompt = `${basePrompt}
Sua tarefa é priorizar os requisitos com base em critérios como valor para o usuário, viabilidade técnica e impacto no negócio. Utilize uma abordagem como MoSCoW (Must, Should, Could, Won’t) ou similar. Justifique brevemente cada decisão. O retorno deve ser organizado e legível. Evite repetir os requisitos literalmente, resuma o necessário. 

Requisitos:
${texto}
`;
  } else {
    // Default para "validar"
    prompt = `${basePrompt}
Sua tarefa é identificar problemas de ambiguidade, inconsistência, incompletude ou falta de clareza nos requisitos fornecidos. Apresente os pontos problemáticos com sugestões de correção de forma organizada e objetiva.

Requisitos:
${texto}
`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resultado = response.text();

    res.json({ resultado });
  } catch (erro) {
    console.error("Erro ao chamar Gemini:", erro);
    res.status(500).json({ erro: "Falha ao acessar a Gemini API." });
  }
});

app.listen(3000, () => console.log("Servidor rodando com Gemini em http://localhost:3000"));
