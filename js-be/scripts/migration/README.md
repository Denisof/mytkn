# Database Migrations

This directory contains database migration scripts for the DLos Token backend.

## Available Migrations

### Initial Migration (`initial.js`)

Populates the database with sample proposal data for testing and development.

**Data included:**
- 8 sample proposals with various states (executed/pending)
- Multiple votes per proposal (For/Against/Abstain)
- Realistic vote counts and timestamps
- Different scenarios (passing, failing, executed proposals)

**Usage:**

```bash
# Using npm script
npm run migrate

# Or directly with node
node scripts/migration/initial.js
```

**Sample Data Overview:**

1. **Proposal #1** - Treasury allocation (✅ Executed, Passed)
2. **Proposal #2** - Quadratic voting (⏳ Pending, Winning)
3. **Proposal #3** - DeFi partnerships (✅ Executed, Passed)
4. **Proposal #4** - Token burn mechanism (⏳ Pending, Winning)
5. **Proposal #5** - Mobile wallet (⏳ Pending, Losing)
6. **Proposal #6** - Cross-chain bridge (⏳ Pending, Winning)
7. **Proposal #7** - Grants program (✅ Executed, Passed)
8. **Proposal #8** - Lower threshold (⏳ Pending, Losing)

## Creating New Migrations

To create a new migration:

1. Create a new file in this directory (e.g., `add_users.js`)
2. Follow the pattern from `initial.js`:
   ```javascript
   require('dotenv').config();
   const mongoose = require('mongoose');
   const config = require('../../src/bootstrap/config');
   
   async function runMigration() {
     await mongoose.connect(config.mongodb.uri);
     // Your migration logic here
     await mongoose.connection.close();
   }
   
   if (require.main === module) {
     runMigration();
   }
   ```
3. Add a script to `package.json` if needed

## Environment Variables

Make sure you have the following in your `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/dlos-token
```

## Notes

- Migrations should be idempotent (safe to run multiple times)
- Always backup your data before running migrations in production
- The initial migration clears existing proposals before inserting new ones

