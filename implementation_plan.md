# 📋 Alumni Tracking System — Uygulama ve Geliştirme Planı

Bu belge, **Alumni Tracking System** projesinin tamamlanan ve planlanan geliştirme aşamalarını, mimari kararlarını ve teknik yol haritasını özetler.

---

## 🎯 Temel Kural (The One-Command Rule)

> **Tüm sistem `docker compose up` komutuyla tek seferde ayağa kalkmalıdır.**

Tüm servisler (Express.js backend, PostgreSQL 16 veritabanı, loglama birimleri ve web arayüzü) Docker Compose ile orkestre edilmektedir.

---

## 🚀 Geliştirme Aşamaları ve Tamamlanan İşler

### Aşama 1: Başlangıç Kurulumu & Docker Entegrasyonu ✅
- Node.js 20 & Express.js altyapısının kurulması.
- Docker Compose ile konteynerizasyon (`alumni_backend`, `alumni_db`).
- Sağlık kontrolü endpoint'i: `GET /api/health` → `200 OK`.

### Aşama 2: Veritabanı Mimarisi & DDD (`ddd.md`) ✅
- 3NF normalizasyonunda ilişkisel şema tasarımı.
- `departments`, `users`, `alumni_profiles`, `student_profiles`, `academic_profiles`, `job_experiences`, `job_postings`, `applications`, `mentorship_requests`, `events`, `announcements` tabloları.
- **İş İlanı (`job_postings`) Kuralları:**
  - `title`: Zorunlu (`NOT NULL`), maksimum 120 karakter (`VARCHAR(120)`).
  - `company`: Zorunlu (`NOT NULL`).
  - `city`: Zorunlu ve açıkça belirtilmiş şehir (`city VARCHAR(100) NOT NULL`).
  - `short_description`: Tüm iş ilanlarında pozisyon için kısa tanım/özet (`VARCHAR(300) NOT NULL`).
  - `wage`: Pozisyona ait ücret/maaş bilgisi açık ve net (`VARCHAR(100) NOT NULL`).
  - `idx_job_postings_city` arama ve filtreleme indeksi.

### Aşama 3: MVC Mimarisi & PostgreSQL Modelleri ✅
- Model katmanı: `UserModel`, `DepartmentModel`, `JobPostingModel`, `ApplicationModel`, `AnnouncementModel`.
- View katmanı: `homeView.js`, `userViews.js`, `departmentViews.js`, `jobPostingViews.js`, `applicationViews.js`.
- Controller katmanı: REST API denetleyicileri ve Web denetleyicileri ayrımı.
- Swagger UI entegrasyonu: `http://localhost:3000/api/swagger`.

### Aşama 4: Nested Routes & İlişkisel Kaynak Yönetimi ✅
- Direct rotalar: `/api/job-postings`, `/api/applications` vb.
- Nested rotalar (`mergeParams: true`):
  - `/api/departments/:departmentId/job-postings`
  - `/api/users/:userId/job-postings`
  - `/api/job-postings/:jobPostingId/applications`
  - `/api/users/:userId/applications`

### Aşama 5: Middleware & Guardian Altyapısı (Bugünkü Geliştirmeler) ✅
- **1. Logger Middleware (`loggerMiddleware.js`):**
  - Gelen HTTP isteklerini dinler, çalışma süresini (`process.hrtime`) hesaplar.
  - Durum kodlarına göre renkli ANSI çıktıları terminale yazar (`2xx` yeşil, `3xx` camgöbeği, `4xx` sarı, `5xx` kırmızı).
- **2. 404 Guardian Middleware (`notFoundGuardian.js`):**
  - Eşleşmeyen tüm geçersiz istekleri yakalar.
  - Açık ve net bir hata sebebi (**Reason**) üretir.
  - Hataları `logs/error.logs` dosyasına kaydeder.
  - REST API isteklerine yapılandırılmış 404 JSON nesnesi döner.
  - Web/tarayıcı isteklerini otomatik olarak generic 404 sayfasına (`/404`) yönlendirir (**redirect**).
- **3. Generic 404 Sayfası (`notFoundView.js` & `GET /404`):**
  - İstanbul Üniversitesi YBS temalı genel 404 sayfası.
  - Hatanın sebebini, talep edilen geçersiz URL'yi ve yönlendirme butonlarını barındırır.
- **4. 5xx Guardian Middleware (`serverErrorGuardian.js`):**
  - 4 parametreli `(err, req, res, next)` Express global hata yakalayıcısı.
  - PostgreSQL kısıt ihlallerini (`23505` duplicate key, `23503` foreign key, `23502` not null), syntax hatalarını ve çalışma zamanı istisnalarını tespit ederek açık hata sebebi üretir.
  - Hata izini (stack trace) `logs/error.logs` dosyasına yazar.
- **5. Dosya Loglama Alt Sistemi (`fileLogger.js` & `logs/`):**
  - `logs/error.logs`: Tüm 4xx ve 5xx hatalarının kalıcı denetim kaydı.
  - `logs/combined.logs`: Tüm HTTP isteklerinin erişim günlüğü.
  - Docker Compose'da `./logs:/app/logs` volume bağlaması ile logların ana makinede kalıcılığı sağlandı.

---

## 🔍 Doğrulama & Canlı İzleme

- **Konteyner Logları:**
  ```bash
  cd Alumni && docker compose logs -f backend
  ```
- **Hata Dosyası Log Akışı:**
  ```bash
  tail -f Alumni/logs/error.logs
  ```
- **Sistem Durumu:**
  ```bash
  curl http://localhost:3000/api/health
  ```
