import express from 'express';
import { combineData } from '../controllers/utilController.js';

const utilRouter = express.Router();

utilRouter.route("/combine").post(combineData);

export default utilRouter;