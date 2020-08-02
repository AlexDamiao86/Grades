import express from "express";

const gradesRouter = express.Router();

gradesRouter.get('/', (req, res) => {
  res.send('Hello');
})

export default gradesRouter;