# FVKRY PRVNTA Backend Documentation

![Image](https://github.com/user-attachments/assets/401154ff-2157-48b1-ba00-b31717a689e6)

## Overview
FVKRY PRVNTA is a financial discipline tool designed to help virtual asset owners manage impulsive spending and trading by locking assets (ETH and ERC-20 tokens) for set durations. Users can create multiple sub-vaults within the defined main vaults to manage their locked assets securely. By implementing strategic asset locking mechanisms, the protocol provides structure in volatile markets, countering cognitive biases and promoting long-term financial stability.

This Express.js/Node.js backend serves as the middleware between our frontend application and the smart contract. It handles platform-specific calculations based on smart contract data and third party API endpoints that fetch ETH and ERC20.

## Technology Stack
- Node.js
- Express.js
- Supabase

## Core Functionality
- Custom calculation logic for platform-specific requirements
- Blockchain data retrieval and optimization
- Recording of lock data to an off-chain database for platform statistics calculations.

## API Endpoints

### Blockchain Data Endpoints

#### `POST writeRouter.route("/lockAsset").post(lockAsset)`
- **Description**: For locking ETH or an ERC20 token.
- **Request Body**: 
  - `address`: Wallet address
  - `lockData`: Data about the asset to be locked.
- **Response**:
```json
{
    "message": "Uploaded Successfully!"
}
```

#### `POST writeRouter.route("/lockSchedule").post(lockSchedule)`
- **Description**: Adds an unlock schedule to a fixed lock
- **Request Body**:
    -`scheduleData`: All the data about the unlock schedule e.g. unlock_amount, next_unlock
- **Response**
```json
{
    "status": true
}
```

#### `POST utilRouter.route("/combine").post(combineData)`
- **Description**: Combines data from the smart contract and that from the database to refine it into more informative data
- **Request Body**:
    -`address`: Wallet address
    -`bcData`: Data from the smart contract
- **Response**
```json
[
    {
        "title": "---",
        "amount": 0,
        "start_time": "2025-02-12T07:45:58.174",
        "end_time": "2026-02-14T07:45:58.174",
        "unlock_goal_usd": 0,
        "lock_type": "goal",
        "withdrawn": false,
        "asset_address": "0x0000000000000000000000000000000000000000",
        "asset_symbol": "---",
        "unlock_schedule": 0,
        "next_unlock": "2025-02-19T09:00:00.000",
        "unlock_amount": 0,
        "decimals": 18,
        "unlock_type": "linear"
    },
    ...
]
```

#### `GET readRouter.route('/dashboard/analysis').get(dashboardAnalysis)`
- **Description**: Calculates and analyses the data of all the locks of a particular address.
- **Request Parameter**:
    -`userAddress`: The wallet address
- **Response**
```json
{
    "userAddress": "0x0000000000000000000000000000000000000000",
    "totalVaults": 0,
    "avgLockDays": 0,
    "avgLockDaysByAsset": [
      
    ],
    "uniqueAssets": [
      
    ],
    "upcomingUnlocks": [
      
    ],
    "assetTotals": [
      
    ],
    "assetValues": [
      
    ],
    "totalValueUSD": 0,
    "lockTypeCounts": {
      "fixed": 0,
      "goal": 0
    },
    "lockTypeByAsset": {
      
    },
    "durationDistribution": {
      "days": 0,
      "weeks": 0,
      "months": 0
    },
    "monthlyActivity": [
      
    ],
    "vaults": [
    ]
}
```

## Getting Started

### Prerequisites
```
Node.js >= v21.0.0
npm >= 10.0.0
```

### Installation
```bash
# Clone the repository
git clone https://github.com/calebomondi/fvkry-backend

# Navigate to the project directory
cd fvkry-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your own values
```

### Environment Variables
```
# Server Configuration
PORT=3000

#Database configuration
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_anon_key
```

### Running Locally
```bash
# Development mode with hot-reload
npm start
```

## Project Structure
```
/src
    /controllers     # Request handlers
    /database        # Database configurations
    /routes          # API route definitions
    /utils           # Helper functions
    /index.js        # Main server file
```

## Data Flow Architecture
1. Frontend makes request to API endpoint and parses necessary data from the smart contract
2. Backend authenticates/validates request (if applicable)
3. Backend fetches required data from database then it combines it with the smart contract data
4. Backend processes/calculates required information
5. Backend returns formatted response to frontend

## Optimization Strategies
- Data caching mechanisms to reduce blockchain calls
- Batch processing for multiple requests
- Parallel database calls 

## Error Handling
The API uses the following error codes:
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Resource Not Found
- `500` - Server Error

## Security Considerations
- Rate limiting implementation
- API key management

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Submit pull request

## License
MIT License