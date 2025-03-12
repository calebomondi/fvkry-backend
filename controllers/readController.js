import supabase from "../database/db.js";
import { analyzeUserVaults } from "../utils/utils.js";

export const dashboardAnalysis = async (req, res) => {
    const userAddress = req.query.userAddress;
    const chainId = req.query.chainId;

    try {
        const {data,error} = await supabase
        .from('vaults')
        .select("*")
        .eq("user_address", userAddress)
        .eq("chain_id", chainId);

        if (error) throw error;

        const analysis = analyzeUserVaults(data, userAddress);
        
        res.status(200).json(analysis);

    } catch (error) {
        res.status(500).json({ message: 'Could Not Get Analysis!', error: error.message });
    }
};

export const getFvkryPoints = async (req, res) => {
    const userAddress = req.query.address;

    try {
        const {data,error} = await supabase
        .from('platform_rewards')
        .select('fvkry_points, redeemed, next_check')
        .eq("user_address", userAddress);

        if (error) throw error;

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: 'Could Not Get Fvkry Points!', error: error.message });
    }
}