import express from 'express';
import { dashboardAnalysis, getFvkryPoints } from '../controllers/readController.js';

const readRouter = express.Router();

readRouter.route('/dashboard/analysis').get(dashboardAnalysis);
readRouter.route("/getpoints").get(getFvkryPoints);

export default readRouter;