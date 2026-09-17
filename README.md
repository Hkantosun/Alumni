# Mezun Takip Sistemi (Alumni Tracking System)

## Projenin Amacı

Bu proje, web programlama dersi kapsamında geliştirilen bir **Mezun Takip Sistemi**dir. Sistemin temel amacı, bir eğitim kurumundan mezun olan öğrencilerin bilgilerinin (iletişim bilgileri, mezuniyet yılı, bölüm, mevcut iş/kariyer durumu vb.) kayıt altına alınmasını, güncellenmesini ve takip edilmesini sağlamaktır.

Sistem yalnızca mezunları değil; **halen örgün eğitimine devam eden öğrencileri** ve **akademisyenleri** de kapsayacak şekilde tasarlanacaktır. Bu sayede sistem, kurumun mezunları, mevcut öğrencileri ve akademik kadrosu arasında bütünleşik bir bağlantı ve takip altyapısı sunmayı hedeflemektedir.

Dersin gereği olarak sistemin **çekirdek özellikleri** (temel veri modeli gereksinimleri, olması zorunlu işlevler) eğitmen tarafından belirlenmiştir. Bunun dışında kalan tüm teknik kararlar — veri modeli detayları, kullanılan programlama dili, veritabanı, arayüz tasarımı, isimlendirme ve genel yazılım mimarisi — proje geliştiricisine (öğrenciye) aittir.

Projenin en kritik kısıtı: **sistem tek bir komutla ayağa kalkabilmelidir.**

```bash
docker compose up
```

Bu komut haftalık teslimlerde çalışmak zorunda değildir, ancak projenin nihai hedefi budur ve değerlendirme bu komutla yapılacaktır.

---

## Kullanılan Teknolojiler

### Backend
- **Node.js**
- Framework: **Express.js**

### Veritabanı
- **PostgreSQL**

### Frontend
- **HTML + CSS**
- **Bootstrap / Tailwind CSS**

### Diğer Araçlar
- **Docker & Docker Compose** — tüm servisleri (backend, veritabanı, frontend) tek komutla ayağa kaldırmak için zorunlu
- **Git & GitHub** — versiyon kontrolü
- **Antigravity** — geliştirme ortamı
- **.env dosyası** — ortam değişkenleri (veritabanı bağlantı bilgileri vb.) için, `.gitignore`'a eklenmeli

---

## Kullanıcı Tipleri

Sistemde yer alacak temel kullanıcı grupları:

- **Mezunlar** — mezuniyet bilgileri, iletişim bilgileri, kariyer/iş durumu
- **Örgün Öğrenciler** — halen eğitimine devam eden, henüz mezun olmamış öğrenciler
- **Akademisyenler** — öğretim elemanı/danışman bilgileri
