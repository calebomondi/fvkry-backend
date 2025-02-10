import express from 'express'
import { lockAsset } from '../controllers/writeControllers.js';

const writeRouter = express.Router();

writeRouter.route("/lockAsset").post(lockAsset);

export default writeRouter;