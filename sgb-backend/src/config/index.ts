import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const requiredSecurityVariables = [
  'FRONTEND_URL',
  'JWT_SECRET',
  'COOKIE_SECRET',
  'ADMIN_DEFAULT_EMAIL',
  'ADMIN_DEFAULT_PASSWORD',
] as const;

const missingSecurityVariables = requiredSecurityVariables.filter((name) => !process.env[name]?.trim());

if (process.env.NODE_ENV === 'production' && missingSecurityVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingSecurityVariables.join(', ')}`);
}

if (process.env.NODE_ENV === 'production') {
  if ((process.env.DATABASE_TYPE || 'json') === 'json' && !process.env.DATABASE_URL) {
    throw new Error('Production requires DATABASE_URL or DATABASE_TYPE=postgres.');
  }

  if ((process.env.STORAGE_PROVIDER || 'local') === 'local') {
    throw new Error('Production requires STORAGE_PROVIDER=s3 or STORAGE_PROVIDER=cloudinary.');
  }
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'development_only_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    cookieSecret: process.env.COOKIE_SECRET || 'development_cookie_secret',
  },

  adminDefault: {
    email: process.env.ADMIN_DEFAULT_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_DEFAULT_PASSWORD || 'development-password-change-me',
  },

  db: {
    type: ((process.env.DATABASE_TYPE as 'json' | 'postgres') || (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres') && process.env.DATABASE_TYPE !== 'json' ? 'postgres' : 'json')),
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'sgbagro_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true',
  },

  storage: {
    provider: (process.env.STORAGE_PROVIDER || 'local') as 'local' | 's3' | 'cloudinary',
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_S3_BUCKET || '',
      endpoint: process.env.AWS_S3_ENDPOINT,
      publicUrlPrefix: process.env.AWS_PUBLIC_URL_PREFIX,
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },
    localDir: path.join(process.cwd(), 'uploads'),
  },
};
