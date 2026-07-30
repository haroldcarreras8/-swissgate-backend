const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(__dirname));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `You are the SwissGate AI Guide 🇨🇭, an elite AI assistant embedded inside the SwissGate Core ecosystem.
Your role is to assist users in understanding, navigating, and simulating operations across 55+ global payment gateways and financial modules.
Always respond professionally, concisely, and with maximum accuracy. You support all languages naturally.`;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'manifest.json'));
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION
        });

        const result = await model.generateContent(message);
        const responseText = result.response.text();

        return res.json({ response: responseText });
    } catch (error) {
        console.error("Error connecting to AI:", error);
        return res.status(500).json({ error: "Failed to fetch response from AI Guide." });
    }
});

// Exportar la app para Serverless en Vercel
module.exports = app;
