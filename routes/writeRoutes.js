import express from 'express'
import { lockETH } from '../controllers/writeControllers.js';

const writeRouter = express.Router();

writeRouter.route("/lockETH").get(lockETH);

export default writeRouter;