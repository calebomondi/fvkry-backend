import express from 'express'
import { lockAsset, lockSchedule, updateLock, deleteLock, awardPoints, updatePoints } from '../controllers/writeControllers.js';

const writeRouter = express.Router();

writeRouter.route("/lockAsset").post(lockAsset);
writeRouter.route("/updateLock").post(updateLock);
writeRouter.route("/lockSchedule").post(lockSchedule);
writeRouter.route("/deleteLock").post(deleteLock);
writeRouter.route("/awardPoints").post(awardPoints);
writeRouter.route("/updatePoints").post(updatePoints);

export default writeRouter;