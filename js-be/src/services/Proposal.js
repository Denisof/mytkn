const Proposal = require('../models/Proposal');
const ContextProvider = require('../bootstrap/context');

class ProposalService {
  // Create a new proposal
  static async onCreate(event) {
    const logger = ContextProvider.getLogger();
    const contract = ContextProvider.getContract();
    const proposalId = event.args[0].toString(); // id
    const description = event.args[1]; // description
    const createdAt = event.args[2].toString(); // createdAt timestamp

    logger(`Processing ProposalCreated event for proposal ${proposalId}`);

    let proposal = await this.getProposalById(proposalId);
    if (proposal) {
      logger(`Proposal ${proposalId} already exists, skipping creation`, 'warn');
      return;
    }

    // Create new proposal
    proposal = new Proposal({
      id: parseInt(proposalId),
      events: []
    });

    // Read proposal data from contract to get target, callData, startBlock, endBlock
    const proposalData = await contract.getProposal(proposalId);

    const eventData = {
      type: 'ProposalCreated',
      proposalId: parseInt(proposalId),
      description: description,
      createdAt: createdAt,
      target: proposalData.target,
      callData: proposalData._callData,
      blockNumber: event.blockNumber.toString(),
      transactionHash: event.transactionHash,
      logIndex: event.index,
      timestamp: new Date()
    };
    console.log('Proposal created', eventData);
    const added = proposal.addEvent(eventData);
    if (added) {
      await proposal.save();
      logger(`Proposal ${proposalId} created successfully`);
    } else {
      logger(`Duplicate event for proposal ${proposalId}, skipping`);
    }
  }

  static async onVote(event) {
    const logger = ContextProvider.getLogger();
    const proposalId = event.args[0].toString(); // id
    const voter = event.args[1]; // voter address
    const voteOption = event.args[2]; // vote option (1, 2, or 3)
    const voterBalance = event.args[3]; // voter balance at time of vote

    logger(`Processing Voted event for proposal ${proposalId}`);

    const proposal = await this.getProposalById(proposalId);
    if (!proposal) {
      logger(`Proposal ${proposalId} not found for vote event`, 'error');
      return;
    }

    const eventData = {
      type: 'Voted',
      proposalId: parseInt(proposalId),
      voter: voter,
      vote: parseInt(voteOption),
      amount: voterBalance.toString(), // Amount is stored as vote option for now
      blockNumber: event.blockNumber.toString(),
      transactionHash: event.transactionHash,
      logIndex: event.index,
      timestamp: new Date()
    };

    const added = proposal.addEvent(eventData);
    if (added) {
      await proposal.save();
      logger(`Vote recorded for proposal ${proposalId}`);
    } else {
      logger(`Duplicate vote event for proposal ${proposalId}, skipping`);
    }
  }

  static async onExecute(event) {
    const logger = ContextProvider.getLogger();
    const proposalId = event.args[0].toString(); // id

    logger(`Processing ProposalExecuted event for proposal ${proposalId}`);

    const proposal = await this.getProposalById(proposalId);
    if (!proposal) {
      logger(`Proposal ${proposalId} not found for execute event`, 'error');
      return;
    }

    const eventData = {
      type: 'ProposalExecuted',
      proposalId: parseInt(proposalId),
      executedAt: new Date().toISOString(),
      blockNumber: event.blockNumber.toString(),
      transactionHash: event.transactionHash,
      logIndex: event.index,
      timestamp: new Date()
    };

    const added = proposal.addEvent(eventData);
    if (added) {
      await proposal.save();
      logger(`Proposal ${proposalId} executed successfully`);
    } else {
      logger(`Duplicate execute event for proposal ${proposalId}, skipping`);
    }
  }

  static async getProposalById(id) {
    return await Proposal.findOne({ id: parseInt(id) });
  }

  static async getAllProposals() {
    return await Proposal.find({}).sort({ id: 1 });
  }

  static async getLatestProcessedBlock() {
    const proposal = await Proposal.findOne().sort({ maxBlockNumber: -1 });
    return proposal ? proposal.maxBlockNumber : null;
  }

  static async updateLatestProcessedBlock(blockNumber) {
    // Not needed - maxBlockNumber updates automatically in each Proposal aggregate
    const logger = ContextProvider.getLogger();
    logger(`All proposals updated up to block ${blockNumber}`);
  }
}

module.exports = ProposalService;
