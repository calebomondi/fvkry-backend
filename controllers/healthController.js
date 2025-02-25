//

export const healthCheck = async(req, res) => {
    res.status(200).json({message: 'API is running'});
}