# Alumni Tracking System — Başlangıç Kurulumu

## Hedef

README'ye göre proje şu kuralı takip ediyor:

> Tüm sistem `docker compose up` komutuyla ayağa kalkmalı.

Bu aşamada hedef: `GET /` isteğine `200 OK` döndüren, Docker ile çalışan en minimal Express.js + PostgreSQL yapısını kurmak.

## Yapılacaklar

### 1. Proje Dosya Yapısı

```
Alumni/
├── backend/
│   ├── src/
│   │   └── index.js          # Express uygulaması
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   └── index.html            # Basit HTML ana sayfa
├── docker-compose.yml
└── .env
```

### 2. Backend (Node.js + Express.js)
- `GET /` → `200 OK { "status": "ok" }` döndüren endpoint
- PostgreSQL bağlantısı hazır ama zorunlu değil başlangıçta

### 3. Docker Compose
- `backend` servisi: Node.js + Express
- `db` servisi: PostgreSQL
- Ağ ve volume tanımları

### 4. Tek Komutla Çalıştırma
```bash
docker compose up
```

## Doğrulama
- `curl http://localhost:3000/` → `{"status":"ok"}` veya `200 OK`
