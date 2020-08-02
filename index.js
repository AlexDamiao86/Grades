import express from "express";
import gradesRouter from "./routes/gradesRouter.js";
import { promises as fs } from "fs";

const { readFile } = fs;

const app = express();
//Utiliza formato json na transferencia de informações
app.use(express.json());

app.use('/grade', gradesRouter);

app.listen(3000, async () => {
  console.log('Preparing to read grades.json file..');
  try {
    await readFile("grades.json");  
    console.log('Grades.json file has opened!');
  } catch(err) {
    console.log('It happened some problem as opening grades.json file');
  }
  console.log('Back-end has just started!');
});

