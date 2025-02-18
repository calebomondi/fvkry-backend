import express from 'express'
import { lockAsset, lockSchedule, updateLock } from '../controllers/writeControllers.js';

const writeRouter = express.Router();

writeRouter.route("/lockAsset").post(lockAsset);
writeRouter.route("/updateLock").post(updateLock);
writeRouter.route("/lockSchedule").post(lockSchedule);

export default writeRouter;