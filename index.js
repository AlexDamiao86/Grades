import express from "express";
import winston from "winston";
import gradesRouter from "./routes/gradesRouter.js";
import { promises as fs } from "fs";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./doc.js";

const { readFile } = fs;

global.fileName = "grades.json";

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
}); 

global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new (winston.transports.Console)(), 
    new (winston.transports.File)({ filename: "grades-control-api.log" })
  ],
  format: combine(
    label({ label: "grades-control-api" }), 
    timestamp(),
    myFormat
  )
})

const app = express();
//Utiliza formato json na transferencia de informações
app.use(express.json());

//Disponibiliza que a aplicação seja chamada por outras
app.use(cors());
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/grade', gradesRouter);

app.listen(3000, async () => {
  logger.info('Preparing to read grades.json file..');
  try {
    await readFile(global.fileName);  
    logger.info('Grades.json file has opened!');
    logger.info('Back-end has just started!');
  } catch(err) {
    logger.error('It happened some problem as opening grades.json file\n' + 
       err.message);
  }
});

