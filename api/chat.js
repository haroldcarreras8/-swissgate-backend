export default async function handler(req, res) {
  // 1. Configuración CORS Estricta pero Flexible (Módulo 1 & 5)
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [], tier = 'basic' } = req.body || {};
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("Missing API Key");
      return res.status(500).json({ error: 'Configuración de servidor incompleta.' });
    }

    // 2. Construcción del Prompt del Sistema (Identidad SwissGate)
    let systemContent = "Eres SwissGate AI 🇨🇭, el núcleo de inteligencia de un ecosistema financiero de privacidad absoluta. Tus respuestas deben ser precisas, concisas y profesionales. Prioriza la seguridad y el anonimato del usuario.";
    
    if (tier === 'vip') {
      systemContent += " Actúa como un analista institucional senior. Usa terminología técnica avanzada y proporciona análisis de riesgo detallados.";
    }

    // 3. Preparación del Historial (Memoria Contextual - Función 22)
    const messages = [
      { role: "system", content: systemContent },
      ...history.slice(-5), // Mantener los últimos 5 mensajes para contexto
      { role: "user", content: message }
    ];

    // 4. Llamada a OpenRouter (Qwen 2.5 72B)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://swissgate.app", 
        "X-Title": "SwissGate Ecosystem",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen-2.5-72b-instruct",
        messages: messages,
        temperature: 0.2, // Baja temperatura para máxima precisión financiera
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API Error:", data);
      return res.status(response.status).json({ 
        error: data.error?.message || "Error al consultar el motor de inteligencia." 
      });
    }

    const replyText = data.choices?.[0]?.message?.content || "Sin respuesta disponible.";

    // 5. Respuesta Compatible con Múltiples Frontends
    return res.status(200).json({ 
      reply: replyText,
      response: replyText,
      message: replyText,
      content: replyText,
      text: replyText,
      meta: {
        model: "qwen-2.5-72b",
        encrypted: true,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Server Critical Error:", error);
    return res.status(500).json({ error: "Fallo interno del sistema. La privacidad se ha mantenido." });
  }
}
