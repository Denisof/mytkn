const connectDB = require('./db');
const config = require('./config');
const { ethers, Contract, JsonRpcProvider } = require('ethers');
const DaoContractArtifact = require('../chain/DAOContract.json');
const {logger} = require('../utils/logger');
let provider;
let contract;

// Initialize application context
const initializeContext = async () => {
  try {
    // Connect to Database
    await connectDB();
    console.log('Application context initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application context:', error);
    process.exit(1);
  }

  const {contractAddress, rpcUrl} = config.blockchain;
  if (!contractAddress || !rpcUrl) {
    console.error('Blockchain contract address not set. Certain features may be disabled.');
    console.error('To enable blockchain features, set CONTRACT_ADDRESS in .env');
    process.exit(1);
  }

  provider = new JsonRpcProvider(rpcUrl);
  contract = new Contract(contractAddress, DaoContractArtifact.abi, provider)
};

class ContextProvider {
  getContract() {
    if (!contract) {
      throw new Error("Contract not initialized");
    }
    return contract;
  }

  getProvider() {
    if(!provider){
      throw new Error("Provider not initialized");
    }
    return provider;
  }

  getConfig() {
    if(!config){
      throw new Error("Configuration not initialized");
    }
    return config;
  }

  async initialize(){
    if(!provider || !contract) {
      await initializeContext();
      return;
    }
    throw new Error('Context already initialized');
  }

  getLogger() {
    return logger;
  }
}

module.exports = new ContextProvider();
