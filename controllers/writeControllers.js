import supabase from '../database/db.js';

//lock
export const lockAsset = async (req, res) => {
    const {address, lockData} = req.body;
    console.log(`lockedData: ${lockData}`)
    try {
        // Create promises for both operations
        const userPromise = supabase
            .from('platform_users')
            .upsert({
                address: address,
                last_activity: new Date().toISOString(),
            }, { onConflict: ['address'] })
            .select();

        const startTime = new Date()
        const endTime = new Date()
        endTime.setDate(endTime.getDate() + parseInt(lockData.duration))

        const vaultPromise = supabase
            .from('vaults')
            .insert({
                user_address: address,
                asset_address: lockData.token,
                chain_id: lockData.chainId,
                asset_symbol: lockData.symbol,
                decimals: lockData.decimals,
                title: lockData.title,
                vault_type: lockData.durationType,
                lock_type: lockData.lockType,
                amount: Number(lockData.amount),
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                unlock_goal_usd: Number(lockData.goal),
                unlock_schedule: 0,
                next_unlock: endTime.toISOString(),
                unlock_amount: 0,
                unlock_type: 'after',
                updated_at: new Date().toISOString()
            })
            .select();

        // Run them in parallel
        const [userResult, vaultResult] = await Promise.all([
            userPromise,
            vaultPromise
        ])

        // Separate error handling for each operation
        if (userResult.error) {
            console.error('User upsert failed:', userResult.error)
            throw userResult.error
        }

        if (vaultResult.error) {
            console.error('Vault insert failed:', vaultResult.error)
            throw vaultResult.error
        }

        console.log("Uploaded Successfully!");
        res.status(200).json({message: "Uploaded Successfully!"});

    } catch (error) {
        res.status(500).json({ message: 'Could Not Lock ETH!', error: error.message });
    }
}

//update lock schedule
export const lockSchedule = async (req, res) => {
    const {scheduleData} = req.body;
    try {
        const {data,error} = await supabase
        .from('vaults')
        .update({
            unlock_schedule: scheduleData.duration,
            next_unlock: scheduleData.nextUnlock,
            unlock_amount: scheduleData.amount,
            unlock_type:scheduleData.unlockType,
            updated_at: new Date().toISOString()
        })
        .eq("user_address", scheduleData.userAddress)
        .eq("asset_symbol", scheduleData.assetSymbol)
        .eq("title", scheduleData.lockTitle)
        .eq("amount", scheduleData.lockAmount)
        .eq("chain_id", scheduleData.chainId)
        .select();

        if (error) throw error;

        console.log('Data: ', data);

        res.status(200).json({status: true});
    } catch (error) {
        res.status(500).json({ message: 'Could Not Add Schedule!', error: error.message });
    }
}

//update amount
export const updateLock = async (req, res) => {
    const {address,newData} = req.body;
    try {
        const {data,error} = await supabase
        .from('vaults')
        .update({
            amount: newData.updatedAmount,
            updated_at: new Date().toISOString()
        })
        .eq("user_address", address)
        .eq("asset_symbol", newData.assetSymbol)
        .eq("title", newData.title)
        .eq("chain_id", newData.chainId)
        .select();

        if (error) throw error;

        res.status(200).json({status: true});
    } catch (error) {
        res.status(500).json({ message: 'Could Not Add Schedule!', error: error.message });
    }
}

//delete lock
export const deleteLock = async (req, res) => {
    const {address,vault} = req.body;
    try {
        const {error} = await supabase
        .from('vaults')
        .delete()
        .eq("user_address", address)
        .eq("asset_symbol", vault.assetSymbol)
        .eq("title", vault.title)
        .eq("vault_type", vault.vaultType)
        .eq("chain_id", vault.chainId)

        if (error) throw error;

        res.status(200).json({status: true});
    } catch (error) {
        res.status(500).json({ message: 'Could Delete Lock!', error: error.message });
    }
}

//award points
export const awardPoints = async (req, res) => {
    const {address, points} = req.body;
    
    //next check to be 100 from today
    const nextcheck = new Date()
    nextcheck.setDate(nextcheck.getDate() + 100)
    
    try {       
        const {error} = await supabase
        .from('platform_rewards')
        .insert({
            user_address: address,
            fvkry_points: points,
            redeemed: 0,
            next_check: nextcheck
        })
        .select();

        if (error) throw error;
        
        res.status(200).json({status: true});
    } catch (error) {
        res.status(500).json({ message: 'Could Not Add Points!', error: error.message });
    }
}

export const updatePoints = async (req, res) => {
    const {address, points} = req.body;

    //next check to be 100 from today
    const nextcheck = new Date()
    nextcheck.setDate(nextcheck.getDate() + 100)

    try {       
        const {error} = await supabase
        .from('platform_rewards')
        .update({
            fvkry_points: points,
            next_check: nextcheck
        })
        .eq("user_address", address)
        .select();

        if (error) throw error;

        res.status(200).json({status: true});
    } catch (error) {
        res.status(500).json({ message: 'Could Not Add Points!', error: error.message });
    }
}