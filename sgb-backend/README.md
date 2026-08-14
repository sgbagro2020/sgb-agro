# SGB Agro Industries - Backend REST API (`sgb-backend`)

Production-ready Node.js + Express REST API backend built for SGB Agro Industries. Features JWT authentication with HttpOnly secure cookies, PostgreSQL & JSON database support, multipart image uploads via AWS S3 / Cloudflare R2 / Cloudinary / Local storage, and non-duplicating initial seed logic.

---

## 🌟 Key Features

- **Express REST API**: Clean modular architecture with controllers, middleware, and route modules.
- **Authentication**: JWT token authorization stored in HttpOnly secure cookies (`token`) and Bearer header support.
- **Password Hashing**: Secure `bcryptjs` hashing with 10 salt rounds.
- **Configurable Database**:
  - `json` mode: Zero-config local file database (`data/db.json`) for instant development.
  - `postgres` mode: Auto-creates tables and connects to PostgreSQL for production on Render or Hostinger.
- **Durable File Uploads**:
  - Upload APIs for product images, gallery media, logos, and blog images.
  - Supports `s3` (AWS S3 / Cloudflare R2 / Hostinger S3), `cloudinary`, or `local` disk fallback.
  - Stores only public URLs in the database (no base64 blobs).
- **Auto-Seeding**: Seeds default admin account, products, gallery media, blog posts, and site settings without duplicating existing data.
- **Render Ready**: `package.json` includes Render-compatible build and start commands (`npm start`).

---

## 📁 Project File Structure

```
sgb-backend/
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript compiler settings
├── README.md                 # Project documentation & deployment guide
├── data/
│   └── db.json               # Local JSON database storage (in dev)
├── src/
│   ├── server.ts             # Server entry point & startup listener
│   ├── app.ts                # Express app setup, CORS, middleware, routes
│   ├── config/
│   │   └── index.ts          # Environment configuration parser
│   ├── db/
│   │   ├── index.ts          # Database abstraction (Postgres + JSON file DB)
│   │   ├── schema.ts         # TypeScript schema interfaces & types
│   │   └── seed.ts           # Non-duplicating seed script
│   ├── middleware/
│   │   ├── auth.middleware.ts # JWT verification & requireAdmin guard
│   │   ├── error.middleware.ts# Centralized 404 & error handling
│   │   └── upload.middleware.ts# Multer memory buffer configuration
│   ├── services/
│   │   └── storage.service.ts# S3, Cloudflare R2, Cloudinary, Local upload service
│   ├── utils/
│   │   └── validators.ts     # Input validators & slug generator
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── gallery.controller.ts
│   │   ├── blog.controller.ts
│   │   ├── settings.controller.ts
│   │   ├── upload.controller.ts
│   │   └── user.controller.ts
│   └── routes/
│       ├── auth.routes.ts
│       ├── product.routes.ts
│       ├── gallery.routes.ts
│       ├── blog.routes.ts
│       ├── settings.routes.ts
│       ├── upload.routes.ts
│       └── user.routes.ts
```

---

## 🔑 Environment Variables Reference

Copy `.env.example` to `.env` before running:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Port number for Express server | `3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `FRONTEND_URL` | Your deployed frontend URL for CORS/CSRF checks | `https://your-site.vercel.app` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Generate a long random value |
| `COOKIE_SECRET` | Secret key for cookie parser | Generate a second long random value |
| `ADMIN_DEFAULT_EMAIL` | Default admin email for first seed | Your company/admin email |
| `ADMIN_DEFAULT_PASSWORD` | Default admin password for first seed | Strong password, at least 12 characters |
| `DATABASE_TYPE` | Database driver selection | `json` or `postgres` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` |
| `STORAGE_PROVIDER` | Object storage provider | `local`, `s3`, or `cloudinary` |
| `AWS_ACCESS_KEY_ID` | AWS S3 / R2 Access Key | `your_aws_access_key` |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 / R2 Secret Key | `your_aws_secret_key` |
| `AWS_REGION` | S3 Region | `us-east-1` |
| `AWS_S3_BUCKET` | S3 Bucket Name | `sgb-agro-assets` |

---

## 💻 Local Setup & Installation

1. Navigate to the `sgb-backend` directory:
   ```bash
   cd sgb-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Start development mode with hot-reloading:
   ```bash
   npm run dev
   ```

5. Run database seed manually (optional, server auto-seeds on first boot):
   ```bash
   npm run seed
   ```

---

## 📡 API Routes Overview

### 1. Health & Status
- `GET /health` - Server health check and active engine status.

### 2. Authentication (`/api/auth`)
- `POST /api/auth/login` - Admin login with email & password (returns JWT & sets HttpOnly cookie).
- `POST /api/auth/logout` - Clear authentication cookie.
- `GET /api/auth/me` - Get current logged-in admin user info *(Protected)*.

### 3. Products (`/api/products`)
- `GET /api/products` - List all products (supports filters: `category`, `search`, `availability`, `brand`).
- `GET /api/products/:id` - Fetch single product by ID or SKU.
- `POST /api/products` - Create new product *(Protected Admin)*.
- `PUT /api/products/:id` - Update existing product *(Protected Admin)*.
- `DELETE /api/products/:id` - Delete product *(Protected Admin)*.
- `PATCH /api/products/reorder` - Bulk update display order of products *(Protected Admin)*.

### 4. Gallery Media & Albums (`/api/gallery`)
- `GET /api/gallery/media` - List media items (filters: `category`, `type`, `featured`).
- `GET /api/gallery/media/:id` - Get media item details.
- `POST /api/gallery/media` - Create gallery media item *(Protected Admin)*.
- `PUT /api/gallery/media/:id` - Update media item *(Protected Admin)*.
- `DELETE /api/gallery/media/:id` - Delete media item *(Protected Admin)*.
- `GET /api/gallery/albums` - List all gallery albums.
- `GET /api/gallery/albums/:id` - Get gallery album details with items.
- `POST /api/gallery/albums` - Create gallery album *(Protected Admin)*.
- `PUT /api/gallery/albums/:id` - Update gallery album *(Protected Admin)*.
- `DELETE /api/gallery/albums/:id` - Delete gallery album *(Protected Admin)*.

### 5. Blog Posts (`/api/blog`)
- `GET /api/blog` - List published blog posts (filters: `publishedOnly`, `search`).
- `GET /api/blog/:idOrSlug` - Get blog post by ID or URL slug.
- `POST /api/blog` - Create blog post *(Protected Admin)*.
- `PUT /api/blog/:id` - Update blog post *(Protected Admin)*.
- `DELETE /api/blog/:id` - Delete blog post *(Protected Admin)*.

### 6. Site Settings (`/api/settings`)
- `GET /api/settings` - Fetch site settings (logo, contact info, social links, meta SEO tags).
- `PUT /api/settings` - Update site settings *(Protected Admin)*.

### 7. File Uploads (`/api/upload`)
- `POST /api/upload/product-image` - Upload product image *(Protected Admin)*.
- `POST /api/upload/gallery-media` - Upload gallery photo/video *(Protected Admin)*.
- `POST /api/upload/logo` - Upload site logo *(Protected Admin)*.
- `POST /api/upload/blog-image` - Upload blog post featured image *(Protected Admin)*.

### 8. Admin Users Management (`/api/users`)
- `GET /api/users` - List all admin accounts *(Protected Admin)*.
- `POST /api/users` - Create a new admin account *(Protected Admin)*.
- `PUT /api/users/:id/password` - Update admin user password *(Protected Admin)*.
- `DELETE /api/users/:id` - Delete admin account *(Protected Admin)*.

---

## 🚀 Deploying to Render

1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your repository and choose directory `sgb-backend`.
3. Set the build and start commands:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables on Render dashboard:
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `<Your-Vercel-Frontend-URL>`
   - `JWT_SECRET` = `<a-strong-random-secret-key>`
   - `COOKIE_SECRET` = `<another-strong-random-secret-key>`
   - `ADMIN_DEFAULT_EMAIL` = `<your-admin-email>`
   - `ADMIN_DEFAULT_PASSWORD` = `<a-strong-password-of-at-least-12-characters>`
   - `DATABASE_TYPE` = `postgres`
   - `DATABASE_URL` = `<Your-Render-PostgreSQL-Connection-String>`
   - `STORAGE_PROVIDER` = `s3` (or `cloudinary`)
   - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`, `AWS_REGION`
5. Click **Deploy Web Service**. Render will build the TypeScript project into CJS/ESM and launch `dist/server.js`. The server will automatically connect to PostgreSQL, verify database tables, and run non-duplicating seeds on first launch!

---

## 🚀 Migrating to Hostinger

To host `sgb-backend` on Hostinger VPS or Node.js hosting:
1. Create a PostgreSQL or MySQL database in Hostinger cPanel / VPS.
2. Update `DATABASE_TYPE=postgres` and `DATABASE_URL` in your `.env` file on Hostinger.
3. Install dependencies using `npm install --production`.
4. Build the project using `npm run build`.
5. Run the production build using `npm start` or manage via PM2:
   ```bash
   pm2 start dist/server.js --name "sgb-backend"
   ```
