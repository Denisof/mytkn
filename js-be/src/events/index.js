const ProposalService = require('../services/Proposal');
const ContextProvider = require('../bootstrap/context');

let latestQueriedBlock;

async function update() {
  const contract = ContextProvider.getContract();
  const provider = ContextProvider.getProvider();
  const config = ContextProvider.getConfig();
  const logger = ContextProvider.getLogger();

  // Get the last processed block or start from the configured starting block
  const latestProcessedBlock = latestQueriedBlock ? latestQueriedBlock  :
    await ProposalService.getLatestProcessedBlock();
  const fromBlock = latestProcessedBlock
    ? parseInt(latestProcessedBlock) + 1
    : config.blockchain.startingBlock;

  const latestBlock = await provider.getBlockNumber();

  // Skip if no new blocks
  if (fromBlock > latestBlock) {
    logger(`No new blocks to process. Current: ${fromBlock}, Latest: ${latestBlock}`);
    return;
  }

  logger(`Processing events from block ${fromBlock} to ${latestBlock}`);

  // Query all events in parallel
  const [ProposalCreatedEvents, ProposalExecutedEvents, VotedEvents] = await Promise.all([
    contract.queryFilter('ProposalCreated', fromBlock, latestBlock),
    contract.queryFilter('ProposalExecuted', fromBlock, latestBlock),
    contract.queryFilter('Voted', fromBlock, latestBlock)
  ]);

  logger(`Found ${ProposalCreatedEvents.length} ProposalCreated, ${VotedEvents.length} Voted, ${ProposalExecutedEvents.length} ProposalExecuted events`);

  // Process events in order: Created -> Voted -> Executed
  for (const event of ProposalCreatedEvents) {
    try {
      await ProposalService.onCreate(event);
    } catch (error) {
      logger(`Error processing ProposalCreated event: ${error.message}`, 'error');
    }
  }

  for (const event of VotedEvents) {
    try {
      await ProposalService.onVote(event);
    } catch (error) {
      logger(`Error processing Voted event: ${error.message}`, 'error');
    }
  }

  for (const event of ProposalExecutedEvents) {
    try {
      await ProposalService.onExecute(event);
    } catch (error) {
      logger(`Error processing ProposalExecuted event: ${error.message}`, 'error');
    }
  }

  latestQueriedBlock = latestBlock;
}

module.exports = async function () {
  const config = ContextProvider.getConfig();
  const logger = ContextProvider.getLogger();

  logger('Starting event processor...', 'info');

  while (true) {
    try {
      await update();
    } catch (error) {
      logger(`Error processing events: ${error.message}`, 'error');
      console.error(error.stack);
    }

    // Wait for the polling interval before next iteration
    await new Promise(resolve => setTimeout(resolve, config.blockchain.eventPollingInterval));
  }
}


