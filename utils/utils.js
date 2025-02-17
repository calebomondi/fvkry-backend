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
                unlock_schedule: dbItem.unlock_schedule,
                next_unlock: dbItem.next_unlock,
                unlock_amount: dbItem.unlock_amount,
                unlock_type: dbItem.unlock_type
            };
        }
        return null;
    }).filter(item => item !== null);

    return combinedData
}