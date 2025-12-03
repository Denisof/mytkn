/**
 * Initial Migration Script
 * Populates the database with sample proposals
 *
 * Usage: node scripts/migration/initial.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../../src/bootstrap/config');
const Proposal = require('../../src/models/Proposal');

// Sample proposal data matching the Proposal schema
// vote: 1 = For, 2 = Against, 3 = Abstain
const sampleProposals = [
  {
    id: 1,
    description: 'Proposal to increase community treasury allocation by 10%',
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    executedAt: new Date('2024-01-20T15:30:00Z').toISOString(),
    executed: true,
    voteCountFor: '750000000000000000000',
    voteCountAgainst: '250000000000000000000',
    voteCountNeutral: '100000000000000000000',
    startBlock: '1000000',
    endBlock: '1050000',
    target: '0xabcdef0123456789abcdef0123456789abcdef01',
    callData: '0x',
    votes: [
      {
        voter: '0x2222222222222222222222222222222222222222',
        vote: 1, // For
        amount: '500000000000000000000'
      },
      {
        voter: '0x3333333333333333333333333333333333333333',
        vote: 2, // Against
        amount: '250000000000000000000'
      },
      {
        voter: '0x4444444444444444444444444444444444444444',
        vote: 1, // For
        amount: '250000000000000000000'
      },
      {
        voter: '0x5555555555555555555555555555555555555555',
        vote: 3, // Abstain
        amount: '100000000000000000000'
      }
    ]
  },
  {
    id: 2,
    description: 'Proposal to implement new governance voting mechanism with quadratic voting',
    createdAt: new Date('2024-02-01T12:00:00Z').toISOString(),
    executedAt: null,
    executed: false,
    voteCountFor: '1200000000000000000000',
    voteCountAgainst: '800000000000000000000',
    voteCountNeutral: '200000000000000000000',
    startBlock: '1100000',
    endBlock: '1150000',
    target: '0xabcdef0123456789abcdef0123456789abcdef02',
    callData: '0x123456',
    votes: [
      {
        voter: '0x6666666666666666666666666666666666666666',
        vote: 1, // For
        amount: '600000000000000000000'
      },
      {
        voter: '0x7777777777777777777777777777777777777777',
        vote: 1, // For
        amount: '600000000000000000000'
      },
      {
        voter: '0x8888888888888888888888888888888888888888',
        vote: 2, // Against
        amount: '800000000000000000000'
      },
      {
        voter: '0x9999999999999999999999999999999999999999',
        vote: 3, // Abstain
        amount: '200000000000000000000'
      }
    ]
  },
  {
    id: 3,
    description: 'Proposal to establish partnerships with three major DeFi protocols',
    createdAt: new Date('2024-03-01T09:00:00Z').toISOString(),
    executedAt: new Date('2024-03-10T14:20:00Z').toISOString(),
    executed: true,
    voteCountFor: '2000000000000000000000',
    voteCountAgainst: '500000000000000000000',
    voteCountNeutral: '0',
    startBlock: '1200000',
    endBlock: '1250000',
    target: '0xabcdef0123456789abcdef0123456789abcdef03',
    callData: '0xabcdef',
    votes: [
      {
        voter: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        vote: 1, // For
        amount: '1000000000000000000000'
      },
      {
        voter: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        vote: 1, // For
        amount: '1000000000000000000000'
      },
      {
        voter: '0xcccccccccccccccccccccccccccccccccccccccc',
        vote: 2, // Against
        amount: '500000000000000000000'
      }
    ]
  },
  {
    id: 4,
    description: 'Proposal to update token burn mechanism and introduce buyback program',
    createdAt: new Date('2024-04-05T11:30:00Z').toISOString(),
    executedAt: null,
    executed: false,
    voteCountFor: '3500000000000000000000',
    voteCountAgainst: '1500000000000000000000',
    voteCountNeutral: '500000000000000000000',
    startBlock: '1300000',
    endBlock: '1350000',
    target: '0xabcdef0123456789abcdef0123456789abcdef04',
    callData: '0xdeadbeef',
    votes: [
      {
        voter: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        vote: 1, // For
        amount: '2000000000000000000000'
      },
      {
        voter: '0xffffffffffffffffffffffffffffffffffffffff',
        vote: 1, // For
        amount: '1500000000000000000000'
      },
      {
        voter: '0x0000000000000000000000000000000000000001',
        vote: 2, // Against
        amount: '1500000000000000000000'
      },
      {
        voter: '0x0000000000000000000000000000000000000002',
        vote: 3, // Abstain
        amount: '500000000000000000000'
      }
    ]
  },
  {
    id: 5,
    description: 'Proposal to fund development of mobile wallet application',
    createdAt: new Date('2024-05-15T13:45:00Z').toISOString(),
    executedAt: null,
    executed: false,
    voteCountFor: '1800000000000000000000',
    voteCountAgainst: '2200000000000000000000',
    voteCountNeutral: '300000000000000000000',
    startBlock: '1400000',
    endBlock: '1450000',
    target: '0xabcdef0123456789abcdef0123456789abcdef05',
    callData: '0x',
    votes: [
      {
        voter: '0x0000000000000000000000000000000000000003',
        vote: 1, // For
        amount: '1800000000000000000000'
      },
      {
        voter: '0x0000000000000000000000000000000000000004',
        vote: 2, // Against
        amount: '2200000000000000000000'
      },
      {
        voter: '0x0000000000000000000000000000000000000005',
        vote: 3, // Abstain
        amount: '300000000000000000000'
      }
    ]
  },
  {
    id: 6,
    description: 'Proposal to implement cross-chain bridge for multi-network support',
    createdAt: new Date('2024-06-10T08:00:00Z').toISOString(),
    executedAt: null,
    executed: false,
    voteCountFor: '5000000000000000000000',
    voteCountAgainst: '1000000000000000000000',
    voteCountNeutral: '500000000000000000000',
    startBlock: '1500000',
    endBlock: '1550000',
    target: '0xabcdef0123456789abcdef0123456789abcdef06',
    callData: '0xcafe',
    votes: [
      {
        voter: '0x0000000000000000000000000000000000000006',
        vote: 1, // For
        amount: '3000000000000000000000'
      },
      {
        voter: '0x0000000000000000000000000000000000000007',
        vote: 1, // For
        amount: '2000000000000000000000'
      },
      {
        voter: '0x0000000000000000000000000000000000000008',
        vote: 2, // Against
        amount: '1000000000000000000000'
      },
      {
        voter: '0x0000000000000000000000000000000000000009',
        vote: 3, // Abstain
        amount: '500000000000000000000'
      }
    ]
  },
  {
    id: 7,
    description: 'Proposal to launch community grants program with $500K budget',
    createdAt: new Date('2024-07-20T14:30:00Z').toISOString(),
    executedAt: new Date('2024-07-25T10:15:00Z').toISOString(),
    executed: true,
    voteCountFor: '8000000000000000000000',
    voteCountAgainst: '2000000000000000000000',
    voteCountNeutral: '1000000000000000000000',
    startBlock: '1600000',
    endBlock: '1650000',
    target: '0xabcdef0123456789abcdef0123456789abcdef07',
    callData: '0xbabe',
    votes: [
      {
        voter: '0x000000000000000000000000000000000000000a',
        vote: 1, // For
        amount: '4000000000000000000000'
      },
      {
        voter: '0x000000000000000000000000000000000000000b',
        vote: 1, // For
        amount: '4000000000000000000000'
      },
      {
        voter: '0x000000000000000000000000000000000000000c',
        vote: 2, // Against
        amount: '2000000000000000000000'
      },
      {
        voter: '0x000000000000000000000000000000000000000d',
        vote: 3, // Abstain
        amount: '1000000000000000000000'
      }
    ]
  },
  {
    id: 8,
    description: 'Proposal to reduce proposal creation threshold to 1000 tokens',
    createdAt: new Date('2024-08-05T16:00:00Z').toISOString(),
    executedAt: null,
    executed: false,
    voteCountFor: '3000000000000000000000',
    voteCountAgainst: '6000000000000000000000',
    voteCountNeutral: '800000000000000000000',
    startBlock: '1700000',
    endBlock: '1750000',
    target: '0xabcdef0123456789abcdef0123456789abcdef08',
    callData: '0xdead',
    votes: [
      {
        voter: '0x000000000000000000000000000000000000000e',
        vote: 1, // For
        amount: '3000000000000000000000'
      },
      {
        voter: '0x000000000000000000000000000000000000000f',
        vote: 2, // Against
        amount: '6000000000000000000000'
      },
      {
        voter: '0x0000000000000000000000000000000000000010',
        vote: 3, // Abstain
        amount: '800000000000000000000'
      }
    ]
  }
];

/**
 * Helper function to calculate vote percentages
 */
function getVotePercentages(proposal) {
  const forVotes = BigInt(proposal.voteCountFor);
  const againstVotes = BigInt(proposal.voteCountAgainst);
  const neutralVotes = BigInt(proposal.voteCountNeutral);
  const totalVotes = forVotes + againstVotes + neutralVotes;

  if (totalVotes === 0n) {
    return { for: '0.00', against: '0.00', abstain: '0.00' };
  }

  const forPercent = (Number(forVotes * 10000n / totalVotes) / 100).toFixed(2);
  const againstPercent = (Number(againstVotes * 10000n / totalVotes) / 100).toFixed(2);
  const abstainPercent = (Number(neutralVotes * 10000n / totalVotes) / 100).toFixed(2);

  return { for: forPercent, against: againstPercent, abstain: abstainPercent };
}

/**
 * Run migration
 */
async function runMigration() {
  console.log('🚀 Starting initial migration...');
  console.log(`📊 Connecting to MongoDB: ${config.mongodb.uri}`);

  try {
    // Connect to database
    await mongoose.connect(config.mongodb.uri);
    console.log('✓ MongoDB connected successfully');

    // Clear existing proposals
    const deleteResult = await Proposal.deleteMany({});
    console.log(`✓ Cleared ${deleteResult.deletedCount} existing proposals`);

    // Insert sample proposals
    const insertedProposals = await Proposal.insertMany(sampleProposals);
    console.log(`✓ Inserted ${insertedProposals.length} sample proposals`);

    // Display summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 MIGRATION SUMMARY');
    console.log('='.repeat(60));

    for (const proposal of insertedProposals) {
      const percentages = getVotePercentages(proposal);
      const status = proposal.executed ? '✅ Executed' : '⏳ Pending';

      console.log(`\n📝 Proposal #${proposal.id}:`);
      console.log(`   ${proposal.description}`);
      console.log(`   Target: ${proposal.target}`);
      console.log(`   Status: ${status}`);
      console.log(`   Created: ${new Date(proposal.createdAt).toLocaleDateString()}`);
      if (proposal.executedAt) {
        console.log(`   Executed: ${new Date(proposal.executedAt).toLocaleDateString()}`);
      }
      console.log(`   Votes: ${proposal.votes.length} total`);
      console.log(`   Results:`);
      console.log(`     👍 For:     ${percentages.for}%`);
      console.log(`     👎 Against: ${percentages.against}%`);
      console.log(`     🤷 Abstain: ${percentages.abstain}%`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Migration completed successfully!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n✓ MongoDB connection closed');
    process.exit(0);
  }
}

// Run migration if script is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration, sampleProposals };

