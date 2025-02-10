//import supabase from '../database/db.js'

//lock
export const lockAsset = async (req, res) => {
    const {data} = req.body;

    try {
        console.log(`data: ${JSON.stringify(data)}`);
        res.status(200).json({message: JSON.stringify(data)});
    } catch (error) {
        res.status(500).json({ message: 'Could Not Lock ETH!', error: error.message });
    }
}