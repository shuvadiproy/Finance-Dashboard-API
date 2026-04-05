const app = require('./src/app');
const connectDB = require('./src/config/db');
const config = require('./src/config/env');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(config.port, () => {
      console.log(`\n🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
      console.log(`📖 API Docs: http://localhost:${config.port}/api-docs`);
      console.log(`❤️  Health:   http://localhost:${config.port}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
