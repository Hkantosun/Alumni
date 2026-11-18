# 🎨 Brand & Design Guidelines (`brand.md`)

> **İstanbul Üniversitesi • İktisat Fakültesi • Yönetim Bilişim Sistemleri (İÜ YBS)**  
> Mezun & Kariyer Takip Portalı — Görsel Kimlik ve Tasarım Sistemi

---

## 📑 İçindekiler

- [1. Marka Kimliği ve Konumlandırma](#1-marka-kimliği-ve-konumlandırma)
- [2. Logo ve Monogram Kullanımı](#2-logo-ve-monogram-kullanımı)
- [3. Renk Paleti](#3-renk-paleti)
- [4. Tipografi](#4-tipografi)
- [5. Arayüz Bileşenleri ve Düzen İlkeleri](#5-arayüz-bileşenleri-ve-düzen-ilkeleri)
- [6. Dil ve İletişim Tonu](#6-dil-ve-iletişim-tonu)

---

## 1. Marka Kimliği ve Konumlandırma

**İÜ YBS Mezun & Kariyer Portalı**, 1453'ten gelen köklü **İstanbul Üniversitesi** akademik mirasını modern **Yönetim Bilişim Sistemleri (MIS)** teknolojisiyle birleştiren kurumsal bir platformdur.

- **Ana Slogan:** *Teknoloji, Yönetim ve Verinin Kesiştiği Köklü Çatı*
- **Hedef Kitle:** Mezunlar, aktif lisans/lisansüstü öğrenciler ve akademik kadro.
- **Tasarım Felsefesi:** Koyu (*dark-mode*) zemin üzerinde kurumsal bordo ve altın vurgularla akademik prestiji yansıtan; camgöbeği (*cyan*) ve sıcak mercan aksanlarla modern teknoloji hissiyatı veren sade, ferah ve yüksek kontrastlı bir arayüz.

---

## 2. Logo ve Monogram Kullanımı

Üst navigasyon ve marka alanında **minimalist tipografik monogram** kullanılır:

- **Monogram Rozeti:** `38px × 38px`, `10px` köşe yuvarlatmalı (`border-radius: 10px`) kare rozet içinde **`İÜ`** harfleri (`Cinzel`, `800` kalınlık).
- **Rozet Zemini:** Kurumsal bordo (`rgba(128, 0, 32, 0.95)`) ve altın (`rgba(212, 175, 55, 0.35)`) çapraz degrade; çevresinde ince altın kenarlık.
- **Marka Başlığı:** `İstanbul Üniversitesi✦` — Başlık sonunda yer alan altın yıldız (`✦`, `#d4af37`) markanın ayırt edici imzasıdır.
- **Alt Etiket:** `YBS Mezun & Kariyer Portalı` (`0.74rem`, `#94a3b8`).

---

## 3. Renk Paleti

### Kurumsal & Zemin Renkleri

| Renk Adı | Hex / Değer | CSS Değişkeni | Kullanım Alanı |
|---|---|---|---|
| **Deep Midnight** | `#070a12` | `--bg` | Ana sayfa arka planı |
| **Dark Navy Surface** | `#0f1626` | `--surface` | İstatistik şeridi ve ikincil paneller |
| **Card Background** | `#151d30` / `#1e293b` | `--card-bg` | İçerik kartları ve tablolar |
| **Card Hover** | `#1e2942` | `--card-hover` | Etkileşimli kart üzeri durumu |
| **İÜ Burgundy** | `#800020` | `--iu-burgundy` | Kurumsal miras ve logo rozeti |
| **İÜ Gold** | `#d4af37` | `--iu-gold` | Akademik prestij, rozetler, başlık vurguları |

### Vurgu & Durum Renkleri

| Renk Adı | Hex / Değer | CSS Değişkeni | Kullanım Alanı |
|---|---|---|---|
| **Tech Cyan** | `#38bdf8` | `--accent` | İkincil butonlar, aktif bağlantılar, veri vurguları |
| **CTA Coral** | `#e86034` → `#d44e24` | — | Header sağ üst **Swagger API** pill butonu |
| **Emerald** | `#10b981` | `--emerald` | Başarı durumları ve sistem sağlığı |
| **Amber** | `#f59e0b` | `--amber` | Uyarılar ve düzenleme aksiyonları |
| **Purple** | `#a855f7` | `--purple` | Mezun ağı ve nested rota rozetleri |
| **Text Primary** | `#f8fafc` | `--text` | Ana metinler ve başlıklar |
| **Text Muted** | `#94a3b8` | `--muted` | Alt metinler, etiketler ve pasif linkler |

---

## 4. Tipografi

Platformda iki ana yazı tipi ailesi Google Fonts üzerinden kullanılır:

1. **Başlık ve Kurumsal Kimlik (`Cinzel`, Serif):**
   - Ağırlıklar: `600`, `700`, `800`
   - Kullanım: Marka adı, Hero ana başlığı (`.hero-title`), 404/Hakkında sayfa başlıkları.
   - Karakteri: Klasik, köklü ve akademik otoriteyi temsil eder.

2. **Arayüz ve İçerik (`Inter`, Sans-Serif):**
   - Ağırlıklar: `300`, `400`, `500`, `600`, `700`, `800`
   - Fallback: `system-ui, -apple-system, sans-serif`
   - Kullanım: Navigasyon linkleri, açıklamalar, formlar, veri tabloları ve butonlar.
   - Karakteri: Yüksek okunabilirlik, temiz ve modern dijital deneyim.

---

## 5. Arayüz Bileşenleri ve Düzen İlkeleri

- **Minimalist Sticky Header (`.top-header`):**
  - Yükseklik: `72px`, yapışkan (`position: sticky; top: 0`).
  - Arka Plan: Yarı saydam buzlu cam (`rgba(7, 10, 18, 0.88)` + `backdrop-filter: blur(20px)`).
  - Düzen: Sol tarafta `İÜ✦` marka alanı, ortada emojisiz sade menü linkleri (`Ana Sayfa`, `Mezunlar`, `Bölümler`, `İlanlar`, `Başvurular`, `Duyurular`, `Hakkında`), sağda oval mercan `Swagger API` butonu.
  - Aktif Sekme Göstergesi: Altın-mercan degrade `2px` alt çizgi.
- **Hero Alanı:**
  - Tam ekran genişliğinde (*full-bleed*) sessiz ve donanım hızlandırmalı kampüs atmosferi; soldan sağa koyu degrade katmanı ile metin okunabilirliği korunur.
- **Responsive Davranış:**
  - `868px` ve altındaki ekranlarda header bağlantıları kırılmadan yatay kaydırılabilir (*horizontal scroll*) yapıya geçer.

---

## 6. Dil ve İletişim Tonu

- **Dil:** Türkçe arayüz metinleri, teknik API/mimari referanslarında evrensel İngilizce terimler (`Swagger API`, `Direct Route`, `Nested Route`).
- **Ton:** Saygılı, akademik, güven veren ve yönlendirici.
- **Görsel Temizlik:** Navigasyon linklerinde kalabalık ikonlar yerine tipografik hiyerarşi; içerik kartlarında ve aksiyon butonlarında anlamlı görsel işaretçiler tercih edilir.
