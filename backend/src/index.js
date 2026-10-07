require('dotenv').config();
const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const UserModel = require('./models/userModel');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger OpenAPI Tanımlaması
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Alumni Tracking System API',
    version: '1.0.0',
    description: 'Alumni Backend REST API Dokümantasyonu (Swagger UI)'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Yerel Geliştirme Sunucusu (Local Development Server)'
    }
  ],
  paths: {
    '/': {
      get: {
        summary: 'Ana Sayfa - Root Status Check',
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/health': {
      get: {
        summary: 'Sağlık Kontrolü (Health Check)',
        responses: { 200: { description: 'Sistem durumu ve zaman damgası JSON yanıtı' } }
      }
    },
    '/api/users': {
      get: {
        summary: 'Tüm Kullanıcıları Sıralanmış Olarak Listele',
        parameters: [
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', default: 'id' },
            description: 'Sıralanacak alan (ör. id, name, createdAt)'
          },
          {
            name: 'order',
            in: 'query',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
            description: 'Sıralama yönü (asc: artan, desc: azalan)'
          }
        ],
        responses: { 200: { description: 'Sıralı kullanıcı listesi' } }
      },
      post: {
        summary: 'Yeni Kullanıcı Verisi Gönder / Kaydet',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { name: 'Ahmet Yılmaz', email: 'ahmet@example.com' }
              }
            }
          }
        },
        responses: {
          201: { description: 'Kullanıcı oluşturuldu' },
          400: { description: 'Boş veya geçersiz veri' }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        summary: 'ID ile Tek Kullanıcı Detayı Getir',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Kullanıcı bilgisi' },
          404: { description: 'Kullanıcı bulunamadı' }
        }
      },
      put: {
        summary: 'Kullanıcı Verisini Tamamen Güncelle (PUT)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { name: 'Ahmet Güncel', email: 'ahmet.yeni@example.com' }
              }
            }
          }
        },
        responses: {
          200: { description: 'Kullanıcı tamamen güncellendi' },
          404: { description: 'Kullanıcı bulunamadı' }
        }
      },
      patch: {
        summary: 'Kullanıcı Verisini Kısmen Güncelle (PATCH)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { city: 'İstanbul' }
              }
            }
          }
        },
        responses: {
          200: { description: 'Kullanıcı kısmen güncellendi' },
          404: { description: 'Kullanıcı bulunamadı' }
        }
      },
      delete: {
        summary: 'Belirli Kullanıcıyı Sil (Diğer Kayıtları Koru)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Kullanıcı silindi' },
          404: { description: 'Kullanıcı bulunamadı' }
        }
      }
    },
    '/Hello': {
      get: {
        summary: 'Hello World Yanıtı',
        responses: { 200: { description: 'OK' } }
      }
    },
    '/Hello/{name}': {
      get: {
        summary: 'Isme Özel Karşılama',
        parameters: [
          { name: 'name', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'OK' } }
      }
    },
    '/sum/{number1}/{number2}': {
      get: {
        summary: 'İki Sayının Toplamı',
        parameters: [
          { name: 'number1', in: 'path', required: true, schema: { type: 'number' } },
          { name: 'number2', in: 'path', required: true, schema: { type: 'number' } }
        ],
        responses: { 200: { description: 'Toplama sonucu' } }
      }
    }
  }
};

const swaggerSpec = swaggerJsdoc({ swaggerDefinition, apis: [] });

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI rotası (/api/swagger)
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// GET / — Ana sayfa, sistem durumu
app.get('/', (req, res) => {
  res.send('ok');
});

// GET /api/health - Health check JSON response
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is healthy',
    timestamp: new Date().toISOString()
  });
});

// POST /api/users - POST ile gönderilen veriyi bellek içine kaydet
app.post('/api/users', (req, res) => {
  const payload = req.body;

  if (!payload || Object.keys(payload).length === 0) {
    return res.status(400).json({
      error: 'Gönderilen veri boş olamaz.'
    });
  }

  const newUser = UserModel.create(payload);

  res.status(201).json({
    message: 'Veri başarıyla alındı ve kaydedildi',
    user: newUser
  });
});

// GET /api/users - tüm kullanıcıları sıralanmış şekilde listele
app.get('/api/users', (req, res) => {
  const { sortBy = 'id', order = 'asc' } = req.query;

  const sortedUsers = UserModel.getAll({ sortBy, order });

  res.json({
    count: sortedUsers.length,
    sortBy,
    order,
    users: sortedUsers
  });
});

// PUT /api/users/:id - Tam güncelleme (Full update)
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const payload = req.body;

  if (!payload || Object.keys(payload).length === 0) {
    return res.status(400).json({
      error: 'PUT isteğinde güncellenecek veri (body) boş olamaz.'
    });
  }

  const updatedUser = UserModel.update(userId, payload);

  if (!updatedUser) {
    return res.status(404).json({
      error: `ID'si ${userId} olan kullanıcı bulunamadı.`
    });
  }

  res.json({
    message: 'Kullanıcı verisi tamamen güncellendi (PUT)',
    user: updatedUser
  });
});

// PATCH /api/users/:id - Kısmi güncelleme (Partial update)
app.patch('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const payload = req.body;

  if (!payload || Object.keys(payload).length === 0) {
    return res.status(400).json({
      error: 'PATCH isteğinde güncellenecek veri alanı bulunamadı.'
    });
  }

  const updatedUser = UserModel.patch(userId, payload);

  if (!updatedUser) {
    return res.status(404).json({
      error: `ID'si ${userId} olan kullanıcı bulunamadı.`
    });
  }

  res.json({
    message: 'Kullanıcı verisi kısmen güncellendi (PATCH)',
    user: updatedUser
  });
});

// GET /api/users/:id - Belirli bir kullanıcıyı ID'sine göre getir
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = UserModel.getById(userId);

  if (!user) {
    return res.status(404).json({
      error: `ID'si ${userId} olan kullanıcı bulunamadı.`
    });
  }

  res.json({
    user
  });
});

// DELETE /api/users/:id - Belirli bir kullanıcıyı sil (Diğer kayıtlı kullanıcılar korunur)
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const deletedUser = UserModel.delete(userId);

  if (!deletedUser) {
    return res.status(404).json({
      error: `ID'si ${userId} olan kullanıcı bulunamadı.`
    });
  }

  res.json({
    message: `ID'si ${userId} olan kullanıcı başarıyla silindi.`,
    deletedUser,
    remainingCount: UserModel.count()
  });
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
        <p>This platform is designed to connect graduates, faster networking, and share career opportunities. Stay tuned for more features!</p>
      </div>
    </body>
    </html>
  `);
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Alumni backend listening on http://localhost:${PORT}`);
});
