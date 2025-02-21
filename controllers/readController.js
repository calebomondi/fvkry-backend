import supabase from "../database/db.js";
import { analyzeUserVaults } from "../utils/utils.js";

export const dashboardAnalysis = async (req, res) => {
    const userAddress = req.query.userAddress;

    try {
        const {data,error} = await supabase
        .from('vaults')
        .select("*")
        .eq("user_address", userAddress);

        if (error) throw error;

        console.log(data);

        const analysis = analyzeUserVaults(data, userAddress);
        
        res.status(200).json(analysis);

    } catch (error) {
        res.status(500).json({ message: 'Could Not Get Analysis!', error: error.message });
    }
};