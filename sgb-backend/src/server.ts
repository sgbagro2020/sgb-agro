import app from './app.js';
import { config } from './config/index.js';
import { initDB } from './db/index.js';
import { seedDatabase } from './db/seed.js';

async function startServer() {
  try {
    console.log('🚀 Initializing SGB Agro Industries Backend Server...');

    // Initialize Database
    await initDB();

    // Auto seed default data on startup
    await seedDatabase();

    const PORT = Number(process.env.PORT || config.port || 3000);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`==================================================`);
      console.log(`🌱 SGB Agro Industries Backend API Server Running`);
      console.log(`🌐 Port: ${PORT}`);
      console.log(`📦 Database Engine: ${config.db.type}`);
      console.log(`📁 Storage Provider: ${config.storage.provider}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
      console.log(`==================================================`);
    });
  } catch (err) {
    console.error('❌ Failed to start SGB Agro backend server:', err);
    process.exit(1);
  }
}

startServer();
