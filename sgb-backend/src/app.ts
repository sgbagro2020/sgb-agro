import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { config } from './config/index.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import { csrfOriginProtection } from './middleware/csrf.middleware.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import blogRoutes from './routes/blog.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// Trust proxy in production for secure cookies behind reverse proxies (Render, Cloud Run)
if (config.nodeEnv === 'production') {
  app.set('trust proxy', 1);
}

// CORS setup - Exclude wildcard '*' to enforce credentials safety
const baseAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

if (config.frontendUrl && config.frontendUrl !== '*') {
  if (!baseAllowedOrigins.includes(config.frontendUrl)) {
    baseAllowedOrigins.push(config.frontendUrl);
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no Origin header (health checks, server-to-server requests)
      if (!origin) {
        return callback(null, true);
      }

      const isAllowedExplicit = baseAllowedOrigins.includes(origin);

      if (isAllowedExplicit) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Body and Cookie Parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser(config.jwt.cookieSecret));

// Static files directory for local uploads
const uploadsDir = config.storage.localDir;
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Health Check Endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'sgb-backend-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    databaseType: config.db.type,
    storageProvider: config.storage.provider,
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'sgb-backend-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    databaseType: config.db.type,
    storageProvider: config.storage.provider,
  });
});

// CSRF / Origin Protection Middleware for Write Requests
app.use(csrfOriginProtection);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);

// 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
