//lock
export const lockETH = async (req, res) => {
    try {
        //lock
        //add to db asset/user/update balance
        res.status(200).json({message:"Heyy!"});
    } catch (error) {
        res.status(500).json({ message: 'Could Not Lock ETH!', error: error.message });
    }
}