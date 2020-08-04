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

gradesRouter.get('/total', async (req, res) => {
  try {
    // console.log(`student: ${req.query.student}, subject: ${req.query.subject}`);
    const gradesFile = await readFile(global.fileName);
    const gradesData = JSON.parse(gradesFile);

    const gradesStudentSubject = gradesData.grades.filter(
      grade => grade.student === req.query.student &&
               grade.subject === req.query.subject );

    if (gradesStudentSubject.length === 0) 
      throw new Error('Estudante/matéria não localizados...');

    var total = gradesStudentSubject.reduce(
      (total, grade) => total + grade.value, 0);

    res.send({ total });
  } catch(err) {
    res.status(400).send({ error: err.message });
  }
})

gradesRouter.get('/average', async (req, res) => { 
  try {
    // console.log(`subject: ${req.query.subject}, type: ${req.query.type}`);

    const gradesFile = await readFile(global.fileName);
    const gradesData = JSON.parse(gradesFile);

    const gradesSubjectType = gradesData.grades.filter(
      grade => grade.type === req.query.type &&
               grade.subject === req.query.subject );
    
    if (gradesSubjectType.length === 0) 
      throw new Error('Matéria/tipo de atividade não localizados...');

    var totalGrades = gradesSubjectType.reduce(
      (total, grade) => total + grade.value, 0);

    const average = totalGrades / gradesSubjectType.length;

    res.send({ average });
  } catch(err) {
    res.status(400).send({ error: err.message });
  }
})

gradesRouter.get('/top3', async (req, res) => { 
  try {
    // console.log(`subject: ${req.query.subject}, type: ${req.query.type}`);

    const gradesFile = await readFile(global.fileName);
    const gradesData = JSON.parse(gradesFile);

    const gradesSubjectType = gradesData.grades.filter(
      grade => grade.type === req.query.type &&
               grade.subject === req.query.subject );
    
    if (gradesSubjectType.length === 0) 
      throw new Error('Matéria/tipo de atividade não localizados...');

    gradesSubjectType.sort(
      (a, b) => { return b.value - a.value });

    const top3Grades = gradesSubjectType.slice(0, 3);

    res.send(top3Grades);
  } catch(err) {
    res.status(400).send({ error: err.message });
  }
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