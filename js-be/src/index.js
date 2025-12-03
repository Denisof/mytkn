const app = require('./app');
const contextProvider = require('./bootstrap/context');

const startServer = async () => {
  try {
    await contextProvider.initialize();
    const config = contextProvider.getConfig();
    // Start Express Server
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

