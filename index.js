const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.json({ message: "SwissGate Core Backend Active 🚀🇨🇭" });
});

// Ruta súper fácil de cadena de texto (String)
app.get('/api/test', (req, res) => {
  res.send("¡Hola Harold! El servidor de SwissGate responde perfecto con esta cadena de texto. 🇨🇭⚡");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
