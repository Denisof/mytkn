const mongoose = require('mongoose');

// Event schemas
const proposalCreatedEventSchema = new mongoose.Schema({
  type: { type: String, default: 'ProposalCreated' },
  proposalId: { type: Number, required: true },
  description: { type: String, required: true },
  createdAt: { type: String, required: true },
  startBlock: { type: String, required: true },
  endBlock: { type: String, required: true },
  target: { type: String, required: true, match: /^0x[a-fA-F0-9]{40}$/ },
  callData: { type: String, default: '0x' },
  blockNumber: { type: String, required: true },
  transactionHash: { type: String, required: true, match: /^0x[a-fA-F0-9]{64}$/ },
  logIndex: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const votedEventSchema = new mongoose.Schema({
  type: { type: String, default: 'Voted' },
  proposalId: { type: Number, required: true },
  voter: { type: String, required: true, match: /^0x[a-fA-F0-9]{40}$/ },
  vote: { type: Number, required: true, enum: [1, 2, 3] },
  amount: { type: String, required: true },
  blockNumber: { type: String, required: true },
  transactionHash: { type: String, required: true, match: /^0x[a-fA-F0-9]{64}$/ },
  logIndex: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const proposalExecutedEventSchema = new mongoose.Schema({
  type: { type: String, default: 'ProposalExecuted' },
  proposalId: { type: Number, required: true },
  executedAt: { type: String, required: true },
  blockNumber: { type: String, required: true },
  transactionHash: { type: String, required: true, match: /^0x[a-fA-F0-9]{64}$/ },
  logIndex: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

// Proposal aggregate schema
const proposalSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },

  // Event store - source of truth
  events: [mongoose.Schema.Types.Mixed],

  // Computed state
  description: String,
  createdAt: String,
  executedAt: String,
  executed: { type: Boolean, default: false },
  voteCountFor: { type: String, default: '0' },
  voteCountAgainst: { type: String, default: '0' },
  voteCountNeutral: { type: String, default: '0' },
  startBlock: String,
  endBlock: String,
  target: String,
  callData: String,
  maxBlockNumber: String,

  version: { type: Number, default: 0 }
});

// Indexes
proposalSchema.index({ id: 1 }, { unique: true });
proposalSchema.index({ executed: 1 });
proposalSchema.index({ 'events.blockNumber': 1 });
proposalSchema.index({ 'events.transactionHash': 1 });
proposalSchema.index({ 'events.voter': 1 });
proposalSchema.index({ maxBlockNumber: 1 });

// Method to check if event is duplicate
proposalSchema.methods.isDuplicateEvent = function(transactionHash, logIndex) {
  return this.events.some(e =>
    e.transactionHash === transactionHash && e.logIndex === logIndex
  );
};

// Method to apply events and rebuild computed state
proposalSchema.methods.applyEvents = function() {
  // Reset computed state
  this.voteCountFor = '0';
  this.voteCountAgainst = '0';
  this.voteCountNeutral = '0';
  this.executed = false;
  let maxBlock = '0';

  // Apply all events in order
  this.events.forEach(event => {
    switch(event.type) {
      case 'ProposalCreated':
        this.description = event.description;
        this.createdAt = event.createdAt;
        this.startBlock = event.blockNumber;
        this.target = event.target;
        this.callData = event.callData;
        break;

      case 'Voted':
        if (event.vote === 1) {
          this.voteCountFor = (BigInt(this.voteCountFor) + BigInt(event.amount)).toString();
        } else if (event.vote === 2) {
          this.voteCountAgainst = (BigInt(this.voteCountAgainst) + BigInt(event.amount)).toString();
        } else if (event.vote === 3) {
          this.voteCountNeutral = (BigInt(this.voteCountNeutral) + BigInt(event.amount)).toString();
        }
        break;

      case 'ProposalExecuted':
        this.executed = true;
        this.executedAt = event.executedAt;
        this.endBlock = event.blockNumber;
        break;
    }

    // Track max block number
    if (BigInt(event.blockNumber) > BigInt(maxBlock)) {
      maxBlock = event.blockNumber;
    }
  });

  this.maxBlockNumber = maxBlock;
  this.version += 1;
};

// Method to add event and update state
proposalSchema.methods.addEvent = function(event) {
  if (this.isDuplicateEvent(event.transactionHash, event.logIndex)) {
    return false;
  }

  this.events.push(event);
  this.applyEvents();
  return true;
};

module.exports = mongoose.model('Proposal', proposalSchema);
