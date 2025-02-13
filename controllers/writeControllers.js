import supabase from '../database/db.js';

const zeroAddress = "0x0000000000000000000000000000000000000000";

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
                asset_address: zeroAddress,
                asset_symbol: lockData.symbol,
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

