import supabase from "../database/db.js";
import { combinedVaultData } from "../utils/utils.js";

//combine data from db with that from sm
export const combineData = async (req, res) => {
    const { address, bcData } = req.body;

    try {
        const { data, error } = await supabase
        .from("vaults")
        .select("*")
        .eq("user_address",address);
        
        if (error) throw error

        const dataCombined = combinedVaultData(bcData,data);

        res.status(200).json(dataCombined)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}