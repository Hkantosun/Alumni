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

// GET /home - Temporary Main Page
app.get('/home', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Temporary Main Page</title>
      <style>
        body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #1e1e2f; color: #fff; }
        .container { text-align: center; background: #2a2a40; padding: 3rem 5rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); }
        h1 { margin-bottom: 1rem; color: #6366f1; }
        p { font-size: 1.1rem; color: #cbd5e1; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Alumni System</h1>
        <p>This is a temporary main page.</p>
      </div>
    </body>
    </html>
  `);
});

// GET /about - Temporary About Page
app.get('/about', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>About Us</title>
      <style>
        body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #1e1e2f; color: #fff; }
        .container { text-align: center; background: #2a2a40; padding: 3rem 5rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); max-width: 600px; }
        h1 { margin-bottom: 1rem; color: #10b981; }
        p { font-size: 1.1rem; color: #cbd5e1; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>About Alumni System</h1>
        <p>This platform is designed to connect graduates, foster networking, and share career opportunities. Stay tuned for more features!</p>
      </div>
    </body>
    </html>
  `);
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Alumni backend listening on http://localhost:${PORT}`);
});
