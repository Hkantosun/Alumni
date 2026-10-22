require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const apiUserRoutes = require('./routes/apiUserRoutes');
const userRoutes = require('./routes/userRoutes');
const apiAnnouncementRoutes = require('./routes/apiAnnouncementRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const apiDepartmentRoutes = require('./routes/apiDepartmentRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const apiJobPostingRoutes = require('./routes/apiJobPostingRoutes');
const jobPostingRoutes = require('./routes/jobPostingRoutes');
const apiApplicationRoutes = require('./routes/apiApplicationRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

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
    '/api/announcements': {
      get: {
        summary: 'Tüm Duyuruları Listele (JSON API)',
        tags: ['API Announcements'],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Kategoriye göre filtrele' },
          { name: 'sortBy', in: 'query', schema: { type: 'string', default: 'id' } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' } }
        ],
        responses: { 200: { description: 'Sıralı ve filtreli duyuru listesi' } }
      },
      post: {
        summary: 'Yeni Duyuru Oluştur (JSON API)',
        tags: ['API Announcements'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { title: 'Mezunlar Günü 2026', content: 'Etkinlik 15 Mayısta.', category: 'Etkinlik', author: 'Mezunlar Derneği' }
              }
            }
          }
        },
        responses: { 201: { description: 'Duyuru oluşturuldu' } }
      }
    },
    '/api/announcements/{id}': {
      get: {
        summary: 'ID ile Tek Duyuru Detayı Getir (JSON API)',
        tags: ['API Announcements'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Duyuru detay bilgisi' }, 404: { description: 'Duyuru bulunamadı' } }
      },
      put: {
        summary: 'Duyuru Verisini Tamamen Güncelle (PUT JSON API)',
        tags: ['API Announcements'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Duyuru güncellendi' } }
      },
      patch: {
        summary: 'Duyuru Verisini Kısmen Güncelle (PATCH JSON API)',
        tags: ['API Announcements'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Duyuru kısmen güncellendi' } }
      },
      delete: {
        summary: 'Duyuruyu Sil (DELETE JSON API)',
        tags: ['API Announcements'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Duyuru silindi' } }
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
    },
    '/api/departments': {
      get: {
        summary: 'Tüm Bölümleri Listele (Direct API Route)',
        tags: ['API Departments'],
        responses: { 200: { description: 'Bölümler listesi ve ilişkili ilan sayıları' } }
      },
      post: {
        summary: 'Yeni Bölüm Ekle (Direct API Route)',
        tags: ['API Departments'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { code: 'SE', name: 'Yazılım Mühendisliği', faculty: 'Mühendislik Fakültesi' }
              }
            }
          }
        },
        responses: { 201: { description: 'Bölüm oluşturuldu' } }
      }
    },
    '/api/departments/{id}': {
      get: {
        summary: 'Bölüm Detayı Getir (Direct API Route)',
        tags: ['API Departments'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Bölüm detayı' }, 404: { description: 'Bulunamadı' } }
      }
    },
    '/api/departments/{departmentId}/job-postings': {
      get: {
        summary: 'Bölüme Ait İlanları Listele (Nested API Route: Department -> Jobs)',
        tags: ['Nested Routes'],
        parameters: [{ name: 'departmentId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Bölüme hedeflenmiş ilanlar' } }
      },
      post: {
        summary: 'Bölüm Altında Yeni İlan Yayınla (Nested API Route)',
        tags: ['Nested Routes'],
        parameters: [{ name: 'departmentId', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { posted_by_user_id: 1, title: 'Yazılım Stajyeri', company: 'Google', job_type: 'Internship', description: 'Stajyer ilanı' }
              }
            }
          }
        },
        responses: { 201: { description: 'İlan oluşturuldu' } }
      }
    },
    '/api/users/{userId}/job-postings': {
      get: {
        summary: 'Kullanıcının Yayınladığı İlanları Listele (Nested API Route: User -> Jobs)',
        tags: ['Nested Routes'],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Kullanıcıya ait iş ilanları' } }
      },
      post: {
        summary: 'Kullanıcı Adına Yeni İlan Yayınla (Nested API Route)',
        tags: ['Nested Routes'],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { title: 'Backend Geliştirici', company: 'Amazon', job_type: 'Full-time', description: 'Açıklama' }
              }
            }
          }
        },
        responses: { 201: { description: 'İlan oluşturuldu' } }
      }
    },
    '/api/job-postings': {
      get: {
        summary: 'Tüm İlanları Listele (Direct API Route)',
        tags: ['API Job Postings'],
        parameters: [
          { name: 'sortBy', in: 'query', schema: { type: 'string' } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
          { name: 'jobType', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'İlanlar listesi' } }
      },
      post: {
        summary: 'Yeni İlan Oluştur (Direct API Route)',
        tags: ['API Job Postings'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { posted_by_user_id: 1, department_id: 1, title: 'Full Stack Dev', company: 'Acme', job_type: 'Full-time', description: 'İlan metni' }
              }
            }
          }
        },
        responses: { 201: { description: 'İlan oluşturuldu' } }
      }
    },
    '/api/job-postings/{id}': {
      get: {
        summary: 'ID ile Tek İlan Getir (Direct API Route)',
        tags: ['API Job Postings'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'İlan detayı' }, 404: { description: 'Bulunamadı' } }
      },
      put: {
        summary: 'İlanı Tamamen Güncelle (Direct API Route)',
        tags: ['API Job Postings'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'İlan güncellendi' } }
      },
      delete: {
        summary: 'İlanı Sil (Direct API Route)',
        tags: ['API Job Postings'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'İlan silindi' } }
      }
    },
    '/api/applications': {
      get: {
        summary: 'Tüm Başvuruları Listele (Direct API Route)',
        tags: ['API Applications'],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'under_review', 'accepted', 'rejected', 'withdrawn'] } }
        ],
        responses: { 200: { description: 'Başvurular listesi' } }
      },
      post: {
        summary: 'Yeni Başvuru Gönder (Direct API Route)',
        tags: ['API Applications'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { job_posting_id: 1, applicant_user_id: 12, resume_url: 'https://cv.link', cover_letter: 'Niyet mektubu' }
              }
            }
          }
        },
        responses: { 201: { description: 'Başvuru kaydedildi' } }
      }
    },
    '/api/applications/{id}': {
      get: {
        summary: 'ID ile Tekil Başvuru Detayı (Direct API Route)',
        tags: ['API Applications'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Başvuru detayı' }, 404: { description: 'Bulunamadı' } }
      },
      put: {
        summary: 'Başvuru Durumu ve Detayını Güncelle (Direct API Route)',
        tags: ['API Applications'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Başvuru güncellendi' } }
      },
      delete: {
        summary: 'Başvuruyu Sil (Direct API Route)',
        tags: ['API Applications'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Başvuru silindi' } }
      }
    },
    '/api/job-postings/{jobPostingId}/applications': {
      get: {
        summary: 'Belirli İlana Yapılan Başvuruları Listele (Nested API Route: JobPosting -> Applications)',
        tags: ['Nested Routes'],
        parameters: [{ name: 'jobPostingId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'İlana ait başvurular' } }
      },
      post: {
        summary: 'Belirli İlan İçin Yeni Başvuru Gönder (Nested API Route)',
        tags: ['Nested Routes'],
        parameters: [{ name: 'jobPostingId', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { applicant_user_id: 12, resume_url: 'https://cv.link', cover_letter: 'Ön yazı' }
              }
            }
          }
        },
        responses: { 201: { description: 'Başvuru kaydedildi' } }
      }
    },
    '/api/users/{userId}/applications': {
      get: {
        summary: 'Kullanıcının Yaptığı Başvuruları Listele (Nested API Route: User -> Applications)',
        tags: ['Nested Routes'],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Kullanıcıya ait başvurular' } }
      },
      post: {
        summary: 'Kullanıcı Adına Yeni Başvuru Yap (Nested API Route)',
        tags: ['Nested Routes'],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { job_posting_id: 1, resume_url: 'https://cv.link', cover_letter: 'Ön yazı' }
              }
            }
          }
        },
        responses: { 201: { description: 'Başvuru kaydedildi' } }
      }
    }
  }
};

const swaggerSpec = swaggerJsdoc({ swaggerDefinition, apis: [] });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Swagger UI rotası (/api/swagger)
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// GET / — Ana sayfa, sistem durumu
app.get('/', (req, res) => {
  if (req.accepts('html') && !req.accepts('json')) {
    return res.redirect('/home');
  }
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
// 1. Direct REST API Routes
app.use('/api/users', apiUserRoutes);
app.use('/api/announcements', apiAnnouncementRoutes);
app.use('/api/departments', apiDepartmentRoutes);
app.use('/api/job-postings', apiJobPostingRoutes);
app.use('/api/applications', apiApplicationRoutes);

// 2. Nested REST API Routes (Child Resources with mergeParams)
app.use('/api/departments/:departmentId/job-postings', apiJobPostingRoutes);
app.use('/api/users/:userId/job-postings', apiJobPostingRoutes);
app.use('/api/job-postings/:jobPostingId/applications', apiApplicationRoutes);
app.use('/api/users/:userId/applications', apiApplicationRoutes);

// 3. Web Views & HTML Actions (Direct & Nested)
app.use('/job-postings', jobPostingRoutes);
app.use('/departments/:departmentId/job-postings', jobPostingRoutes);
app.use('/users/:userId/job-postings', jobPostingRoutes);
app.use('/applications', applicationRoutes);
app.use('/job-postings/:jobPostingId/applications', applicationRoutes);
app.use('/users/:userId/applications', applicationRoutes);
app.use('/', userRoutes);
app.use('/', announcementRoutes);
app.use('/', departmentRoutes);

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Alumni backend listening on http://localhost:${PORT}`);
});
