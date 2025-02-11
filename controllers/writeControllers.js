//

//lock
export const lockAsset = async (req, res) => {
    try {

        res.status(200).json({message: `${JSON.stringify(data)} address: ${address}`});
    } catch (error) {
        res.status(500).json({ message: 'Could Not Lock ETH!', error: error.message });
    }
}

