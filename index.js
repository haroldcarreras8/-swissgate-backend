const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const path = require('path');

const app = express();

// Configuración de seguridad permitiendo la interfaz gráfica
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Servir la interfaz visual (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta de prueba rápida
app.get('/api/test', (req, res) => {
    res.send("¡Hola Harold! El servidor de SwissGate responde perfecto. CH⚡");
});

// Ruta principal para el Chat de IA (Qwen / DashScope)
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.DASHSCOPE_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "Falta configurar la DASHSCOPE_API_KEY en Vercel" });
        }

        const response = await axios.post(
            'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
            {
                model: 'qwen-max',
                messages: [{ role: 'user', content: message }]
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
