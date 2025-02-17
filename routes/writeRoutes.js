import express from 'express'
import { lockAsset, lockSchedule } from '../controllers/writeControllers.js';

const writeRouter = express.Router();

writeRouter.route("/lockAsset").post(lockAsset);
writeRouter.route("/lockSchedule").post(lockSchedule);

export default writeRouter;