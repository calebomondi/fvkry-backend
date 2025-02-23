import express from 'express'

const homeRouter = express.Router();

homeRouter.route('/').get((req, res) => {
    res.send("Hello World, Welcome To Fvkry!");
});

export default homeRouter;