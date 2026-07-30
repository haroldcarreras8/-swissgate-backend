const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Ruta principal de estado
app.get('/', (req, res) => {
  res.json({ message: "SwissGate Core Backend Active 🚀🇨🇭" });
});

// Ruta de prueba rápida
app.get('/api/test', (req, res) => {
  res.send("¡Hola Harold! El servidor de SwissGate responde perfecto con esta cadena de texto. 🇨🇭⚡");
});

// Ruta principal para el Chat de IA (Qwen)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, prompt } = req.body;
    const userMessage = message || prompt;

    if (!userMessage) {
      return res.status(400).json({ error: "Por favor proporciona un mensaje o consulta." });
    }

    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "La API Key de DashScope/Qwen no está configurada en las variables de entorno." });
    }

    const response = await axios.post(
      'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        model: 'qwen-max',
        messages: [
          { role: 'system', content: 'Eres el asistente oficial del ecosistema SwissGate, experto en servicios premium, financieros y tecnológicos. Responde con precisión y amabilidad.' },
          { role: 'user', content: userMessage }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ response: reply, status: "success" });

  } catch (error) {
    console.error("Error al conectar con Qwen:", error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: "Error interno procesando la solicitud de IA",
      details: error.response ? error.response.data : error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
