import express from 'express';
import { dashboardAnalysis } from '../controllers/readController.js';

const readRouter = express.Router();

readRouter.route('/dashboard/analysis').get(dashboardAnalysis);

export default readRouter;