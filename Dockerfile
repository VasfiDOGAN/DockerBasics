# Temel image olarak Node.js image'ını kullan
FROM node:14

# Çalışma dizinini ayarla
WORKDIR /usr/src/app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# mysql2 paketini yükle
RUN npm install mysql2

# Uygulama kodunu kopyala
COPY . .

# Uygulamanın başlatılması
CMD ["node", "app.js"]
