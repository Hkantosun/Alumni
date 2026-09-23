require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GET / — Ana sayfa, sistem durumu
app.get('/', (req, res) => {
  res.send('ok');
});

// GET /Hello
app.get('/Hello', (req, res) => {
  res.send('Hello , World!');
});

// GET /Hello/:name
app.get('/Hello/:name', (req, res) => {
  const name = req.params.name;
  res.send(`Hello , ${name}`);
});

// GET /sum/:number1/:number2
app.get('/sum/:number1/:number2', (req, res) => {
  const num1 = parseFloat(req.params.number1);
  const num2 = parseFloat(req.params.number2);
  
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).send('Lütfen geçerli sayılar girin.');
  }
  
  res.send(`${num1 + num2}`);
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Alumni backend listening on http://localhost:${PORT}`);
});
