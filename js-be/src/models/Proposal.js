const mongoose = require('mongoose');

// Vote subdocument schema
const voteSchema = new mongoose.Schema({
  voter: {
    type: String, // Ethereum address
    required: true,
    match: /^0x[a-fA-F0-9]{40}$/
  },
  vote: {
    type: Number , // true = for, false = against
    required: true,
    match: /^(1|2|3)$/
  },
  amount: {
    type: String, // Vote amount/weight as string for uint256
    required: true
  }
}, { _id: false });

const proposalSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: String, // ISO string timestamp when proposal was created
    required: true
  },
  executedAt: {
    type: String, // ISO string timestamp when proposal was executed
    default: null
  },
  executed: {
    type: Boolean,
    default: false
  },
  voteCountFor: {
    type: String, // Vote count for as string for uint256
    default: '0'
  },
  voteCountAgainst: {
    type: String, // Vote count against as string for uint256
    default: '0'
  },
  voteCountNeutral: {
    type: String, // Vote count abstain as string for uint256
    default: '0'
  },
  votes: [voteSchema], // Array of votes
  startBlock: {
    type: String, // Block number as string for uint256
    required: true
  },
  endBlock: {
    type: String, // Block number as string for uint256
    required: true
  },
  target: {
    type: String, // Target contract address for execution
    required: true,
    match: /^0x[a-fA-F0-9]{40}$/
  },
  callData: {
    type: String, // Hex string for bytes data
    required: true,
    default: '0x'
  }
});

// Index for efficient querying
proposalSchema.index({ id: 1 });
proposalSchema.index({ executed: 1 });
proposalSchema.index({ 'votes.voter': 1 });


module.exports = mongoose.model('Proposal', proposalSchema);

