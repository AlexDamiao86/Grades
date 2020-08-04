import express from "express";
import { promises as fs } from "fs"; 

const { readFile, writeFile } = fs;

const gradesRouter = express.Router();

gradesRouter.post('/', async (req, res) => {
  try {
    const gradesFile = await readFile(global.fileName);
    const gradesData = JSON.parse(gradesFile);

    const { student, subject, type, value } = req.body; 
    const id = gradesData.nextId++; 
    const timestamp = new Date().toJSON();

    const grade = { id, student, subject, type, value, timestamp };

    gradesData.grades.push(grade);

    await writeFile(global.fileName, JSON.stringify(gradesData, null, 2));

    res.send(grade);
  } catch(err) {
    res.status(400).send({ error: err.message });
  }
})

gradesRouter.put('/', async (req, res) => { 
  try { 
    const { id, student, subject, type, value } = req.body; 
  
    const gradesFile = await readFile(global.fileName);
    const gradesData = JSON.parse(gradesFile);

    const index = gradesData.grades.findIndex(grade => grade.id === id);

    if (index === -1) throw new Error('id não existe');

    const timestamp = new Date().toJSON();
    const grade = { id, student, subject, type, value, timestamp };

    gradesData.grades[index] = grade;

    await writeFile(global.fileName, JSON.stringify(gradesData, null, 2));

    res.send(grade);
  } catch(err) {
    res.status(400).send({ error: err.message });  
  }
})

gradesRouter.delete('/:id', async (req, res) => {
  try {
    const gradesFile = await readFile(global.fileName);
    const gradesData = JSON.parse(gradesFile);

    const grade = gradesData.grades.find(
      grade => grade.id === parseInt(req.params.id));

    if (!grade) throw new Error('id não existe');

    gradesData.grades = gradesData.grades.filter(
      grade => grade.id !== parseInt(req.params.id));

    await writeFile(global.fileName, JSON.stringify(gradesData, null, 2));
    res.end();
  } catch(err) {
    res.status(400).send({ error: err.message });
  }
})

gradesRouter.get('/total', (req, res) => {
  res.send(`student: ${req.query.student}, subject: ${req.query.subject}`);
})

gradesRouter.get('/average', (req, res) => { 
  res.send(`subject: ${req.query.subject}, type: ${req.query.type}`);
})

gradesRouter.get('/top3', (req, res) => { 
  res.send(`subject: ${req.query.subject}, type: ${req.query.type}`);
})

gradesRouter.get('/:id', async (req, res) => {
  try {
    const gradesFile = await readFile(global.fileName);
    const gradesData = JSON.parse(gradesFile);

    const grade = gradesData.grades.find(
      grade => grade.id === parseInt(req.params.id));

    if (!grade) throw new Error('id não existe');

    res.send(grade);
  } catch(err) {
    res.status(400).send({ error: err.message });
  }
})

export default gradesRouter;