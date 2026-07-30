const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Servir la interfaz visual en inglés
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta de Chat con IA Políglota Automática
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.DASHSCOPE_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "Missing DASHSCOPE_API_KEY in Vercel environment variables." });
        }

        const response = await axios.post(
            'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
            {
                model: 'qwen-max',
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are SwissGate AI Guide, the core intelligence for an elite global financial and payment ecosystem with 55+ modules. Your corporate interface is in English, but you must act as a native multilingual assistant: automatically detect the language of the user message (Spanish, French, Japanese, German, etc.) and reply fluently in that exact same language, maintaining a professional, high-security financial tone.' 
                    },
                    { role: 'user', content: message }
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
        console.error("Error communicating with Qwen:", error.response ? error.response.data : error.message);
        res.status(500).json({ 
            error: "Internal error processing AI request",
            details: error.response ? error.response.data : error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
