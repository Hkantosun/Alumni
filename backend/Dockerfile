# Node.js 20 LTS üzerinde çalıştır
FROM node:20-alpine

# Çalışma dizini
WORKDIR /app

# Önce sadece package.json kopyala (cache'i verimli kullanmak için)
COPY package.json ./

# Bağımlılıkları yükle
RUN npm install --production

# Uygulama dosyalarını kopyala
COPY src/ ./src/

# 3000 portunu aç
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "src/index.js"]
