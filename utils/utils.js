import axios from "axios";
import { config } from "dotenv";

config();

// combine dbData and bcData
export const combinedVaultData = (bcData, dbData) => {
    const combinedData = dbData.map(dbItem => {
        const matchingBcItem = bcData.find(bcItem => 
            bcItem.title === dbItem.title && 
            dbItem.asset_address === String(bcItem.token) &&
            Number(BigInt(bcItem.amount)) / 10**dbItem.decimals === dbItem.amount
        );

        if (matchingBcItem) {
            return {
                title: dbItem.title,
                amount: dbItem.amount,
                start_time: dbItem.start_time,
                end_time: dbItem.end_time,
                unlock_goal_usd: dbItem.unlock_goal_usd,
                lock_type: dbItem.lock_type,
                withdrawn: matchingBcItem.withdrawn,
                asset_address: dbItem.asset_address,
                asset_symbol: dbItem.asset_symbol,
                decimals: dbItem.decimals,
                unlock_schedule: dbItem.unlock_schedule,
                next_unlock: dbItem.next_unlock,
                unlock_amount: dbItem.unlock_amount,
                unlock_type: dbItem.unlock_type,
                vaultType: matchingBcItem.vaultType,
                lockIndex: matchingBcItem.lockIndex
            };
        }
        return null;
    }).filter(item => item !== null);

    return combinedData
}

export const analyzeUserVaults = (userVaults, userAddress) => {
    
    if (userVaults.length === 0) {
      return { error: "No vaults found for this user" };
    }
    
    // 1. Calculate average lock time (in days) for all assets and by asset type
    const now = new Date();
    const calculateLockDays = (start, end) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (endDate <= now) {
        return 0;
      }
      return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    };
    
    let totalLockDays = 0;
    const assetLockDays = {};
    const assetCounts = {};
    
    userVaults.forEach(vault => {
      const days = calculateLockDays(vault.start_time, vault.end_time);
      totalLockDays += days;
      
      if (!assetLockDays[vault.asset_symbol]) {
        assetLockDays[vault.asset_symbol] = 0;
        assetCounts[vault.asset_symbol] = 0;
      }
      
      assetLockDays[vault.asset_symbol] += days;
      assetCounts[vault.asset_symbol]++;
    });
    
    const avgLockDays = totalLockDays / userVaults.length;
    
    const avgLockDaysByAsset = Object.keys(assetLockDays).map(symbol => ({
      symbol,
      avgDays: assetLockDays[symbol] / assetCounts[symbol]
    }));
    
    // 2. Get unique assets locked
    const uniqueAssets = [...new Set(userVaults.map(vault => vault.asset_address))].map(address => {
      const vault = userVaults.find(v => v.asset_address === address);
      return {
        address,
        symbol: vault.asset_symbol,
        name: vault.title ? vault.title.split(" ").pop() : vault.asset_symbol
      };
    });
    
    // 3. Find upcoming unlocks (within 7 days)
    const upcomingUnlocks = userVaults
      .filter(vault => {
        const unlockDate = new Date(vault.next_unlock);
        const daysUntilUnlock = Math.ceil((unlockDate - now) / (1000 * 60 * 60 * 24));
        return daysUntilUnlock >= 0 && daysUntilUnlock <= 7;
      })
      .map(vault => ({
        id: vault.vault_id,
        title: vault.title,
        asset: vault.asset_symbol,
        unlockDate: vault.next_unlock,
        daysRemaining: Math.ceil((new Date(vault.next_unlock) - now) / (1000 * 60 * 60 * 24)),
        amount: vault.unlock_amount > 0 ? vault.unlock_amount : vault.amount
      }));
    
    // 4. Calculate total amount by asset
    const assetTotals = {};
    userVaults.forEach(vault => {
      if (!assetTotals[vault.asset_symbol]) {
        assetTotals[vault.asset_symbol] = {
          symbol: vault.asset_symbol,
          totalAmount: 0,
          decimals: vault.decimals,
          address: vault.asset_address
        };
      }
      
      // Convert from string to number and handle decimals
      const amount = parseFloat(vault.amount);
      assetTotals[vault.asset_symbol].totalAmount += amount;
    });
    
    //Asset prices
    const assetPrices = {
      'ETH': 3000,
      'MAN': 1,
      'LRT': 0.05,
      'MEG': 21
    };
    
    let totalValueUSD = 0;
    const assetValues = Object.values(assetTotals).map(asset => {
      const price = assetPrices[asset.symbol] || 0;
      const valueUSD = asset.totalAmount * price;
      totalValueUSD += valueUSD;
      
      return {
        ...asset,
        valueUSD,
        price
      };
    });
    
    // 6. Count locks by type
    const lockTypeCounts = {
      fixed: userVaults.filter(v => v.lock_type === 'fixed').length,
      goal: userVaults.filter(v => v.lock_type === 'goal').length
    };
    
    // 7. Additional analysis
    // Calculate lock type distribution by asset
    const lockTypeByAsset = {};
    userVaults.forEach(vault => {
      if (!lockTypeByAsset[vault.asset_symbol]) {
        lockTypeByAsset[vault.asset_symbol] = { fixed: 0, goal: 0 };
      }
      lockTypeByAsset[vault.asset_symbol][vault.lock_type]++;
    });
    
    // Calculate lock duration distribution
    const durationDistribution = {
      days: userVaults.filter(v => v.vault_type === 'days').length,
      weeks: userVaults.filter(v => v.vault_type === 'weeks').length,
      months: userVaults.filter(v => v.vault_type === 'months').length
    };
    
    // Monthly locking activity (count of locks started by month)
    const monthlyActivity = {};
    userVaults.forEach(vault => {
      const month = vault.start_time.substring(0, 7); // Format: YYYY-MM
      if (!monthlyActivity[month]) {
        monthlyActivity[month] = 0;
      }
      monthlyActivity[month]++;
    });
    
    // Return the complete analysis
    return {
      userAddress,
      totalVaults: userVaults.length,
      avgLockDays,
      avgLockDaysByAsset,
      uniqueAssets,
      upcomingUnlocks,
      assetTotals: Object.values(assetTotals),
      assetValues,
      totalValueUSD,
      lockTypeCounts,
      lockTypeByAsset,
      durationDistribution,
      monthlyActivity: Object.entries(monthlyActivity).map(([month, count]) => ({ month, count })),
      vaults: userVaults // Include the raw vaults for any additional processing on the client
    };
};

// MY HEALTH CHECK HELPER FUNCTIONS
//1. Get token list
const getTokenList = async () => {
  const url = 'https://api.coingecko.com/api/v3/coins/list';
  const options = {
    headers: {'Content-Type': 'application/json', 'x-cg-demo-api-key': process.env.GECKO_API_KEY}
  };
  const response = await axios.get(url, options);
  return response.data;
}

//2. Get gecko token ID
const getTokenID = async (tokenSymbol) => {
  const tokenList = await getTokenList();
  const token = tokenList.find(t => t.symbol === tokenSymbol.toLowerCase());
  return token ? token.id : null;
}

//3. Calculate token transanction date
const getTransanctionDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

//4. Get token price
const getTokenPrice = async (tokenSymbol, timestamp) => {
  //get token id and date 
  const tokenID = await getTokenID(tokenSymbol);
  const date = getTransanctionDate(timestamp);

  await new Promise(resolve => setTimeout(resolve, 1200));

  //ftech price
  const url = `https://api.coingecko.com/api/v3/coins/${tokenID}/history?date=${date}`;
  const options = {
    headers: {'Content-Type': 'application/json', 'x-cg-demo-api-key': process.env.GECKO_API_KEY}
  };
  const response = await axios.get(url, options);

  return response.data.market_data.current_price.usd;
}

//5. Get health check
export const myHealthCheck = async (data, senderAddress) => {
  if (!data || !data.operations || !Array.isArray(data.operations)) {
    throw new Error('Invalid input data structure');
  }

  // Filter operations by sender address if provided
  const filteredOperations = senderAddress 
    ? data.operations.filter(op => op.from.toLowerCase() === senderAddress.toLowerCase())
    : data.operations;

    const results = await Promise.all(filteredOperations.map(async (operation) => {
      // Calculate human-readable token amount based on decimals
      const decimals = parseInt(operation.tokenInfo.decimals, 10);
      const rawValue = operation.value;
      const tokenAmount = rawValue / Math.pow(10, decimals);
      
      // Calculate USD value at time of transaction
      const thenPrice = await getTokenPrice(operation.tokenInfo.symbol, operation.timestamp);
      const value_then = tokenAmount * thenPrice;
  
      // Get USD value now
      const tokenPrice = operation.tokenInfo.price.rate;
      const value_now = tokenAmount * tokenPrice;
      
      // Format timestamp to human-readable date
      const date = new Date(operation.timestamp * 1000);
      const formattedDate = date.toISOString();
      
      return {
        // Transaction details
        timestamp: operation.timestamp,
        formattedDate,
        
        // Token details
        token: {
          address: operation.tokenInfo.address,
          name: operation.tokenInfo.name,
          symbol: operation.tokenInfo.symbol,
          decimals: decimals
        },
        
        // Price information
        priceInfo: {
          priceAtTransaction: thenPrice,
          currency: operation.tokenInfo.price.currency,
          priceNow: tokenPrice
        },
        
        // Transfer details
        transfer: {
          rawValue: rawValue,
          tokenAmount: tokenAmount,
          value_now: value_now,
          value_then: value_then
        }
      };
    }));
    
    return results;
}

/**
const url = 'https://api.coingecko.com/api/v3/coins/the-graph/history?date=28-11-2024';
const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-VkNbpY53xafGFAsu6DYSguWN'}
};

const url = 'https://api.coingecko.com/api/v3/coins/list';
const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-VkNbpY53xafGFAsu6DYSguWN'}
};
 */