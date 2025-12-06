# Yayasan Backend (TypeScript + Express + Prisma)

Backend ini dibuat dengan arsitektur enterprise untuk aplikasi manajemen Yayasan / Pondok / Sekolah. Menggunakan **Node.js + TypeScript**, **Express**, **Prisma ORM**, dan **PostgreSQL**.

Struktur ini memudahkan scaling, modular development, dan memungkinkan migrasi backend ke bahasa lain (misalnya Go) di masa depan.

---

## 🚀 Tech Stack

* **Node.js + TypeScript**
* **Express.js**
* **Prisma ORM** (PostgreSQL)
* **PostgreSQL**
* **PM2** (Production Process Manager)
* **Dotenv** untuk environment config

---

## 📁 Folder Structure

```
src/
  controllers/
  services/
  repositories/
  routes/
  middlewares/
  prisma/
  config/
  utils/
  app.ts
  server.ts
```

### Penjelasan Singkat

| Folder/File     | Fungsi                                    |
| --------------- | ----------------------------------------- |
| `controllers/`  | Menerima request & mengembalikan response |
| `services/`     | Business logic utama aplikasi             |
| `repositories/` | Akses database via Prisma                 |
| `routes/`       | Definisi endpoint API                     |
| `middlewares/`  | Auth, role, validation, dll               |
| `prisma/`       | Schema & migrations Prisma                |
| `config/`       | Config environment, database, dll         |
| `app.ts`        | Setup Express                             |
| `server.ts`     | Menjalankan server                        |

---

## ⚙️ Instalasi

Clone repository:

```bash
git clone <url>
cd backend
```

Install dependencies:

```bash
npm install
```

Copy environment file:

```bash
cp .env.example .env
```

---

## 🌐 Environment Variables

Contoh `.env`:

```
DATABASE_URL="postgresql://username:password@localhost:5432/yayasan"
PORT=3000
JWT_SECRET=your-secret
```

---

## 🗄️ Prisma Commands

### Generate Prisma Client

```bash
npx prisma generate
```

### Push schema ke database (development)

```bash
npx prisma db push
```

### Buat migration baru

```bash
npx prisma migrate dev --name init
```

### Deploy migration (production)

```bash
npx prisma migrate deploy
```

---

## 🧪 Development Mode

Jalankan dev server:

```bash
npm run dev
```

Menggunakan `ts-node` + `nodemon`.

---

## 🏭 Build untuk Production

Build TypeScript menjadi JavaScript:

```bash
npm run build
```

File hasil build ada di folder `dist/`.

---

## 🚦 Menjalankan Production dengan PM2

Start pertama kali:

```bash
pm2 start dist/server.js --name yayasan-api
```

Lihat logs:

```bash
pm2 logs yayasan-api
```

Restart:

```bash
pm2 restart yayasan-api
```

---

## 🔄 Cara Update Backend di Server

Setiap kali ada update:

```
git pull
npm ci
npx prisma migrate deploy
npm run build
pm2 restart yayasan-api
```

---

## 📌 API Structure

Contoh pola modular:

```
src/
  controllers/users.controller.ts
  services/users.service.ts
  repositories/users.repository.ts
  routes/users.route.ts
```

Setiap modul terdiri dari:

* **Controller** → menangani request
* **Service** → logic bisnis
* **Repository** → query database

---

## 📚 Target Penggunaan

Dirancang untuk aplikasi:

* Manajemen Pondok Pesantren
* Manajemen Yayasan / Sekolah
* Sistem Santri, Guru, Kelas, Presensi, Keuangan, Asrama
* Dashboard Administrasi

---

## 🤝 Kontribusi

Feel free untuk nambah modul atau minta generator otomatis.