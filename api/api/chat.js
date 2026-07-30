const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_INSTRUCTION = `You are the SwissGate AI Guide 🇨🇭, an elite AI assistant embedded inside the SwissGate Core ecosystem.
Your role is to assist users in understanding, navigating, and simulating operations across 55+ global payment gateways and financial modules.
Always respond professionally, concisely, and with maximum accuracy. You support all languages naturally.`;

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body || {};
        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION
        });

        const result = await model.generateContent(message);
        const responseText = result.response.text();

        return res.status(200).json({ response: responseText });
    } catch (error) {
        console.error("Error connecting to AI:", error);
        return res.status(500).json({ error: "Failed to fetch response from AI Guide." });
    }
};
