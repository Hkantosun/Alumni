# Alumni Tracking System — Başlangıç Kurulumu

## Hedef

README'ye göre proje şu kuralı takip ediyor:

> Tüm sistem `docker compose up` komutuyla ayağa kalkmalı.

Bu aşamada hedef: `GET /` isteğine `200 OK` döndüren, Docker ile çalışan In-Memory Express.js yapısını kurmak.

## Yapılacaklar

### 1. Proje Dosya Yapısı

```
Alumni/
├── backend/
│   ├── src/
│   │   └── index.js          # Express uygulaması
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── .env
```

### 2. Backend (Node.js + Express.js)
- `GET /` → `200 OK` döndüren endpoint
- In-memory veri modelleri (veritabanı bağımlılığı olmadan)

### 3. Docker Compose
- `backend` servisi: Node.js + Express

### 4. Tek Komutla Çalıştırma
```bash
docker compose up
```

## Doğrulama
- `curl http://localhost:3000/` → `{"status":"ok"}` veya `200 OK`
