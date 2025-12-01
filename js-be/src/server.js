const contextProvider = require('./bootstrap/context');
const eventListener = require('./events');

const startServer = async () => {
  try {
    await contextProvider.initialize();
  }catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }

  try {
    console.log('Starting server...');
    await eventListener();
  }catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  }
}
startServer();
