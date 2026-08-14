import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/index.js';

export interface UploadResult {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

// Configure Cloudinary if provider is cloudinary
if (config.storage.provider === 'cloudinary') {
  cloudinary.config({
    cloud_name: config.storage.cloudinary.cloudName,
    api_key: config.storage.cloudinary.apiKey,
    api_secret: config.storage.cloudinary.apiSecret,
  });
}

// Configure S3 client if provider is s3
let s3Client: S3Client | null = null;
if (config.storage.provider === 's3') {
  s3Client = new S3Client({
    region: config.storage.s3.region,
    credentials: {
      accessKeyId: config.storage.s3.accessKeyId,
      secretAccessKey: config.storage.s3.secretAccessKey,
    },
    ...(config.storage.s3.endpoint ? { endpoint: config.storage.s3.endpoint } : {}),
  });
}

export async function uploadFileToStorage(
  file: Express.Multer.File,
  folder: 'products' | 'gallery' | 'logos' | 'blog'
): Promise<UploadResult> {
  const extension = path.extname(file.originalname).toLowerCase() || '.jpg';
  const fileHash = crypto.randomBytes(12).toString('hex');
  const uniqueFilename = `${folder}/${fileHash}_${Date.now()}${extension}`;

  // 1. S3 / Cloudflare R2 / Hostinger Object Storage
  if (config.storage.provider === 's3' && s3Client) {
    const bucket = config.storage.s3.bucket;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: uniqueFilename,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    await s3Client.send(command);

    let publicUrl = '';
    if (config.storage.s3.publicUrlPrefix) {
      publicUrl = `${config.storage.s3.publicUrlPrefix.replace(/\/$/, '')}/${uniqueFilename}`;
    } else if (config.storage.s3.endpoint) {
      publicUrl = `${config.storage.s3.endpoint.replace(/\/$/, '')}/${bucket}/${uniqueFilename}`;
    } else {
      publicUrl = `https://${bucket}.s3.${config.storage.s3.region}.amazonaws.com/${uniqueFilename}`;
    }

    return {
      url: publicUrl,
      filename: uniqueFilename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  // 2. Cloudinary
  if (config.storage.provider === 'cloudinary') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `sgbagro/${folder}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload failed'));
          }
          resolve({
            url: result.secure_url,
            filename: result.public_id,
            mimetype: file.mimetype,
            size: file.size,
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  // 3. Local Disk Upload (Fallback for Development & Local Testing)
  const targetDir = path.join(config.storage.localDir, folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const localFilePath = path.join(targetDir, `${fileHash}_${Date.now()}${extension}`);
  fs.writeFileSync(localFilePath, file.buffer);

  const relativePath = path.relative(config.storage.localDir, localFilePath).replace(/\\/g, '/');
  const publicUrl = `${config.appUrl}/uploads/${relativePath}`;

  return {
    url: publicUrl,
    filename: path.basename(localFilePath),
    mimetype: file.mimetype,
    size: file.size,
  };
}
