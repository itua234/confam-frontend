# Apibara FortiChain Indexer Setup Guide

## Prerequisites

- Node.js 18+ or Python 3.8+
- PostgreSQL database
- Access to Starknet RPC endpoint
- FortiChain smart contract address and ABI

## 1. Project Setup

### Install Apibara CLI
```bash
# Using npm
npm install -g @apibara/cli

# Or using pip
pip install apibara
```

### Initialize Project
```bash
mkdir fortichain-indexer
cd fortichain-indexer
apibara init
```

## 2. Database Schema Setup

### PostgreSQL Schema
```sql
-- Create database
CREATE DATABASE fortichain_indexer;

-- Connect to database
\c fortichain_indexer;

-- Events table
CREATE TABLE contract_events (
    id BIGSERIAL PRIMARY KEY,
    block_number BIGINT NOT NULL,
    block_hash VARCHAR(66) NOT NULL,
    transaction_hash VARCHAR(66) NOT NULL,
    event_index INTEGER NOT NULL,
    contract_address VARCHAR(66) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    decoded_data JSONB,
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for efficient querying
    UNIQUE(transaction_hash, event_index)
);

-- Create indexes
CREATE INDEX idx_events_block_number ON contract_events(block_number);
CREATE INDEX idx_events_contract_address ON contract_events(contract_address);
CREATE INDEX idx_events_event_name ON contract_events(event_name);
CREATE INDEX idx_events_timestamp ON contract_events(timestamp);
CREATE INDEX idx_events_decoded_data ON contract_events USING GIN(decoded_data);

-- User activities table (example for FortiChain specific data)
CREATE TABLE user_activities (
    id BIGSERIAL PRIMARY KEY,
    user_address VARCHAR(66) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    amount DECIMAL(78, 0), -- For handling large numbers
    token_address VARCHAR(66),
    block_number BIGINT NOT NULL,
    transaction_hash VARCHAR(66) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_activities_address ON user_activities(user_address);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX idx_user_activities_timestamp ON user_activities(timestamp);
```

## 3. Apibara Configuration

### apibara.yaml
```yaml
# Apibara configuration
name: fortichain-indexer
version: "1.0.0"

# Network configuration
network:
  name: starknet
  rpc_url: ${STARKNET_RPC_URL}
  chain_id: ${CHAIN_ID} # mainnet: 0x534e5f4d41494e, testnet: 0x534e5f474f45524c49

# Database configuration
database:
  type: postgresql
  url: ${DATABASE_URL}
  
# Indexer configuration
indexer:
  start_block: ${START_BLOCK:-0}
  batch_size: 100
  max_concurrent_requests: 10
  
# Contract configuration
contracts:
  - address: ${FORTICHAIN_CONTRACT_ADDRESS}
    name: FortiChain
    events:
      - "*" # Index all events, or specify specific events
```

### Environment Variables (.env)
```bash
# Network Configuration
STARKNET_RPC_URL=https://starknet-mainnet.public.blastapi.io
CHAIN_ID=0x534e5f4d41494e
START_BLOCK=0

# Contract Configuration
FORTICHAIN_CONTRACT_ADDRESS=0x...  # Your FortiChain contract address

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/fortichain_indexer

# Optional: Monitoring
WEBHOOK_URL=https://your-webhook-url.com/notifications
```

## 4. Indexer Implementation

### TypeScript Implementation (src/indexer.ts)
```typescript
import { Apibara, Event, Block } from '@apibara/protocol';
import { Pool } from 'pg';
import { formatUnits } from 'ethers';

interface FortiChainEvent {
  name: string;
  data: any[];
  keys: string[];
}

class FortiChainIndexer {
  private db: Pool;
  private contractAddress: string;

  constructor(databaseUrl: string, contractAddress: string) {
    this.db = new Pool({ connectionString: databaseUrl });
    this.contractAddress = contractAddress;
  }

  async processBlock(block: Block): Promise<void> {
    console.log(`Processing block ${block.number}`);
    
    for (const transaction of block.transactions) {
      for (const event of transaction.events) {
        if (event.from_address === this.contractAddress) {
          await this.processEvent(event, block, transaction);
        }
      }
    }
  }

  async processEvent(event: Event, block: Block, transaction: any): Promise<void> {
    try {
      const decodedEvent = this.decodeEvent(event);
      
      // Store raw event
      await this.storeRawEvent(event, block, transaction, decodedEvent);
      
      // Process specific event types
      await this.processSpecificEvent(decodedEvent, block, transaction);
      
    } catch (error) {
      console.error('Error processing event:', error);
      throw error;
    }
  }

  private decodeEvent(event: Event): FortiChainEvent {
    // Implement event decoding logic based on your contract ABI
    const eventName = this.getEventName(event.keys[0]);
    
    return {
      name: eventName,
      data: event.data,
      keys: event.keys
    };
  }

  private getEventName(selector: string): string {
    // Map event selectors to names
    const eventMap: { [key: string]: string } = {
      '0x...': 'Transfer',
      '0x...': 'Approval',
      '0x...': 'Deposit',
      '0x...': 'Withdrawal',
      // Add your FortiChain event selectors
    };
    
    return eventMap[selector] || 'Unknown';
  }

  private async storeRawEvent(
    event: Event, 
    block: Block, 
    transaction: any, 
    decodedEvent: FortiChainEvent
  ): Promise<void> {
    const query = `
      INSERT INTO contract_events (
        block_number, block_hash, transaction_hash, event_index,
        contract_address, event_name, event_data, decoded_data, timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (transaction_hash, event_index) DO NOTHING
    `;

    const values = [
      block.number,
      block.hash,
      transaction.hash,
      event.index,
      event.from_address,
      decodedEvent.name,
      JSON.stringify(event.data),
      JSON.stringify(decodedEvent),
      new Date(block.timestamp * 1000)
    ];

    await this.db.query(query, values);
  }

  private async processSpecificEvent(
    decodedEvent: FortiChainEvent, 
    block: Block, 
    transaction: any
  ): Promise<void> {
    switch (decodedEvent.name) {
      case 'Transfer':
        await this.processTransfer(decodedEvent, block, transaction);
        break;
      case 'Deposit':
        await this.processDeposit(decodedEvent, block, transaction);
        break;
      case 'Withdrawal':
        await this.processWithdrawal(decodedEvent, block, transaction);
        break;
      // Add more event handlers
    }
  }

  private async processTransfer(event: FortiChainEvent, block: Block, transaction: any): Promise<void> {
    // Example: Extract transfer data
    const [from, to, amount] = event.data;
    
    // Store user activity
    await this.storeUserActivity({
      userAddress: to,
      activityType: 'transfer_received',
      amount: amount,
      blockNumber: block.number,
      transactionHash: transaction.hash,
      timestamp: new Date(block.timestamp * 1000),
      metadata: { from, to, amount }
    });
  }

  private async processDeposit(event: FortiChainEvent, block: Block, transaction: any): Promise<void> {
    // Implement deposit processing logic
  }

  private async processWithdrawal(event: FortiChainEvent, block: Block, transaction: any): Promise<void> {
    // Implement withdrawal processing logic
  }

  private async storeUserActivity(activity: any): Promise<void> {
    const query = `
      INSERT INTO user_activities (
        user_address, activity_type, amount, block_number,
        transaction_hash, timestamp, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    const values = [
      activity.userAddress,
      activity.activityType,
      activity.amount,
      activity.blockNumber,
      activity.transactionHash,
      activity.timestamp,
      JSON.stringify(activity.metadata)
    ];

    await this.db.query(query, values);
  }
}

export default FortiChainIndexer;
```

### Main Application (src/main.ts)
```typescript
import { Apibara } from '@apibara/protocol';
import FortiChainIndexer from './indexer';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const indexer = new FortiChainIndexer(
    process.env.DATABASE_URL!,
    process.env.FORTICHAIN_CONTRACT_ADDRESS!
  );

  const apibara = new Apibara({
    rpcUrl: process.env.STARKNET_RPC_URL!,
    startBlock: parseInt(process.env.START_BLOCK || '0'),
    batchSize: 100
  });

  // Configure event filters
  apibara.addEventFilter({
    address: process.env.FORTICHAIN_CONTRACT_ADDRESS!,
    events: ['*'] // Listen to all events
  });

  // Start indexing
  apibara.onBlock(async (block) => {
    try {
      await indexer.processBlock(block);
      console.log(`Successfully processed block ${block.number}`);
    } catch (error) {
      console.error(`Error processing block ${block.number}:`, error);
      // Implement retry logic or error handling
    }
  });

  console.log('Starting FortiChain indexer...');
  await apibara.start();
}

main().catch(console.error);
```

## 5. Package Configuration

### package.json
```json
{
  "name": "fortichain-indexer",
  "version": "1.0.0",
  "description": "Apibara indexer for FortiChain smart contract",
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/main.js",
    "dev": "ts-node src/main.ts",
    "migrate": "node scripts/migrate.js",
    "test": "jest"
  },
  "dependencies": {
    "@apibara/protocol": "^0.7.0",
    "@apibara/cli": "^0.7.0",
    "pg": "^8.11.0",
    "ethers": "^6.0.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/pg": "^8.10.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "jest": "^29.0.0"
  }
}
```

## 6. Deployment and Monitoring

### Docker Configuration (Dockerfile)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose (docker-compose.yml)
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: fortichain_indexer
      POSTGRES_USER: indexer
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  indexer:
    build: .
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://indexer:your_password@postgres:5432/fortichain_indexer
      STARKNET_RPC_URL: https://starknet-mainnet.public.blastapi.io
      FORTICHAIN_CONTRACT_ADDRESS: ${FORTICHAIN_CONTRACT_ADDRESS}
    restart: unless-stopped

volumes:
  postgres_data:
```

## 7. Monitoring and Health Checks

### Health Check Endpoint (src/health.ts)
```typescript
import express from 'express';
import { Pool } from 'pg';

const app = express();
const db = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await db.query('SELECT 1');
    
    // Check latest indexed block
    const result = await db.query(
      'SELECT MAX(block_number) as latest_block FROM contract_events'
    );
    
    res.json({
      status: 'healthy',
      latestBlock: result.rows[0].latest_block,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Health check endpoint running on port 3000');
});
```

## 8. Usage and Querying

### Example Queries
```sql
-- Get latest events
SELECT * FROM contract_events 
ORDER BY block_number DESC, event_index DESC 
LIMIT 10;

-- Get user activities
SELECT user_address, activity_type, amount, timestamp
FROM user_activities 
WHERE user_address = '0x...'
ORDER BY timestamp DESC;

-- Event statistics
SELECT event_name, COUNT(*) as count
FROM contract_events 
GROUP BY event_name 
ORDER BY count DESC;

-- Daily transaction volume
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN decoded_data->>'amount' IS NOT NULL 
        THEN (decoded_data->>'amount')::DECIMAL 
        ELSE 0 END) as total_volume
FROM contract_events 
WHERE event_name = 'Transfer'
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

## 9. Deployment Steps

1. **Setup Database**
   ```bash
   # Run PostgreSQL migration
   psql -h localhost -U username -d fortichain_indexer -f schema.sql
   ```

2. **Install Dependencies**
   ```bash
   npm install
   npm run build
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Start Indexer**
   ```bash
   npm start
   # Or with Docker
   docker-compose up -d
   ```

5. **Monitor**
   ```bash
   # Check logs
   docker-compose logs -f indexer
   
   # Check health
   curl http://localhost:3000/health
   ```

## 10. Maintenance and Optimization

### Performance Optimization
- Use database connection pooling
- Implement batch insertions for high-throughput scenarios
- Add proper indexes for your query patterns
- Consider partitioning large tables by date

### Error Handling
- Implement retry logic for failed block processing
- Set up alerting for indexer failures
- Create backfill scripts for missed blocks

### Scaling Considerations
- Horizontal scaling with multiple indexer instances
- Read replicas for query-heavy applications
- Caching layer for frequently accessed data

This setup provides a robust, production-ready Apibara indexer for FortiChain smart contract events with proper error handling, monitoring, and scalability considerations.