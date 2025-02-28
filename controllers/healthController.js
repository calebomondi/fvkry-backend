import axios from 'axios';
import { myHealthCheck } from '../utils/utils.js';

export const healthCheck = async(req, res) => {
    const address = req.query.address;

    //make http call
    const url = `https://api.ethplorer.io/getAddressHistory/${address}?apiKey=freekey&type=transfer&limit=100`
    const response = await axios.get(url);

    //refine responses
    const data = await myHealthCheck(response.data, address);

    res.status(200).json(data);
}