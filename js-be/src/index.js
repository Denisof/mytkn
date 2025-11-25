const app = require('./app');
const config = require('./bootstrap/config');
const connectDB = require('./bootstrap/db');

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Start Express Server
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });

    // Initialize event listener (if blockchain config is set)
    if (config.blockchain.contractAddress && config.blockchain.rpcUrl) {
      // ether related logic would go here
    } else {
      console.log('Blockchain configuration not complete. Event listener not started.');
      console.log('To enable event listening, set CONTRACT_ADDRESS and RPC_URL in .env');
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

