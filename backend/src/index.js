require('dotenv').config();
const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const apiUserRoutes = require('./routes/apiUserRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger OpenAPI Tanımlaması
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Alumni Tracking System API',
    version: '1.0.0',
    description: 'Alumni Backend REST API & Web Page Dokümantasyonu (Swagger UI)'
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
        summary: 'Tüm Kullanıcıları Sıralanmış Olarak Listele (JSON API)',
        tags: ['API Users'],
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
        summary: 'Yeni Kullanıcı Verisi Gönder / Kaydet (JSON API)',
        tags: ['API Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'Alumni' }
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
        summary: 'ID ile Tek Kullanıcı Detayı Getir (JSON API)',
        tags: ['API Users'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Kullanıcı bilgisi' },
          404: { description: 'Kullanıcı bulunamadı' }
        }
      },
      put: {
        summary: 'Kullanıcı Verisini Tamamen Güncelle (PUT JSON API)',
        tags: ['API Users'],
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
        summary: 'Kullanıcı Verisini Kısmen Güncelle (PATCH JSON API)',
        tags: ['API Users'],
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
        summary: 'Belirli Kullanıcıyı Sil (JSON API)',
        tags: ['API Users'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Kullanıcı silindi' },
          404: { description: 'Kullanıcı bulunamadı' }
        }
      }
    },
    '/users': {
      get: {
        summary: 'HTML Mezun & Kullanıcı Listesi Sayfası (Read All View)',
        tags: ['Web Pages (CRUD)'],
        responses: { 200: { description: 'HTML Görünümü' } }
      },
      post: {
        summary: 'Form Üzerinden Yeni Kullanıcı Oluştur (Create Action)',
        tags: ['Web Pages (CRUD)'],
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Kullanıcı Oluşturuldu HTML Sayfası' } }
      }
    },
    '/users/{id}': {
      get: {
        summary: 'HTML Kullanıcı Detay Kartı Sayfası (Read One View)',
        tags: ['Web Pages (CRUD)'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'HTML Görünümü' },
          404: { description: 'Kullanıcı Bulunamadı HTML Sayfası' }
        }
      }
    },
    '/users/{id}/edit': {
      get: {
        summary: 'HTML Kullanıcı Düzenleme Formu (Update Form View)',
        tags: ['Web Pages (CRUD)'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: { 200: { description: 'Düzenleme Formu HTML Görünümü' } }
      }
    },
    '/users/{id}/update': {
      post: {
        summary: 'Form Üzerinden Kullanıcı Güncelle (Update Action)',
        tags: ['Web Pages (CRUD)'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: { 200: { description: 'Güncellendi HTML Sayfası' } }
      }
    },
    '/users/{id}/delete': {
      post: {
        summary: 'Form Üzerinden Kullanıcı Sil (Delete Action)',
        tags: ['Web Pages (CRUD)'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: { 200: { description: 'Silindi HTML Sayfası' } }
      }
    },
    '/home': {
      get: {
        summary: 'Ana Sayfa (Web Page)',
        tags: ['Web Pages'],
        responses: { 200: { description: 'HTML Ana Sayfa Görünümü' } }
      }
    },
    '/about': {
      get: {
        summary: 'Hakkımızda Sayfası (Web Page)',
        tags: ['Web Pages'],
        responses: { 200: { description: 'HTML Hakkımızda Görünümü' } }
      }
    },
    '/Hello': {
      get: {
        summary: 'Hello World Yanıtı',
        tags: ['Utilities'],
        responses: { 200: { description: 'OK' } }
      }
    },
    '/Hello/{name}': {
      get: {
        summary: 'İsme Özel Karşılama',
        tags: ['Utilities'],
        parameters: [
          { name: 'name', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'OK' } }
      }
    },
    '/sum/{number1}/{number2}': {
      get: {
        summary: 'İki Sayının Toplamı',
        tags: ['Utilities'],
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
app.use(express.urlencoded({ extended: true }));

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

// Utility Routes
app.get('/Hello', (req, res) => {
  res.send('Hello , World!');
});

app.get('/Hello/:name', (req, res) => {
  const name = req.params.name;
  res.send(`Hello , ${name}`);
});

app.get('/sum/:number1/:number2', (req, res) => {
  const num1 = parseFloat(req.params.number1);
  const num2 = parseFloat(req.params.number2);

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).send('Lütfen geçerli sayılar girin.');
  }

  res.send(`${num1 + num2}`);
});

// Router Mounting
app.use('/api/users', apiUserRoutes);
app.use('/', userRoutes);

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Alumni backend listening on http://localhost:${PORT}`);
});
