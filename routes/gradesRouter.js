import express from "express";
import { promises as fs } from "fs"; 

const { readFile, writeFile } = fs;

const gradesRouter = express.Router();

function logRequestVerbose(req) {
  logger.verbose(`${req.method} ${req.url}\t
    params: ${JSON.stringify(req.params)}\t
    queryParams: ${JSON.stringify(req.query)}\t
    body: ${JSON.stringify(req.body)}`);
};

gradesRouter.post('/', async (req, res, next) => {
  try {
    logRequestVerbose(req);
    const { student, subject, type, value } = req.body; 

    if (!student) {
      throw new Error("Estudante obrigatório");
    }
    if (!subject) {
      throw new Error("Matéria obrigatória");
    }
    if (!type) {
      throw new Error("Tipo de atividade obrigatória");
    }
    if (value == null) {
      throw new Error("Nota deve ser informada");
    }

    const gradesFile = await readFile(global.fileName);
    const gradesData = JSON.parse(gradesFile);

    const id = gradesData.nextId++; 
    const timestamp = new Date().toJSON();

    const grade = { id, student, subject, type, value, timestamp };
    gradesData.grades.push(grade);

    await writeFile(global.fileName, JSON.stringify(gradesData, null, 2));

    res.send(grade);
  } catch(err) {
      next(err);
  }
});

gradesRouter.put('/', async (req, res, next) => { 
  try { 
    logRequestVerbose(req);
    const { id, student, subject, type, value } = req.body; 

    if (id == null) {
      throw new Error("ID deve ser informado");
    }
    if (!student) {
      throw new Error("Estudante obrigatório");
    }
    if (!subject) {
      throw new Error("Matéria obrigatória");
    }
    if (!type) {
      throw new Error("Tipo de atividade obrigatória");
    }
    if (value == null) {
      throw new Error("Nota deve ser informada");
    }

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
      next(err);  
  }
})

gradesRouter.delete('/:id', async (req, res, next) => {
  try {
    logRequestVerbose(req);
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
      next(err);
  }
})

gradesRouter.get('/total', async (req, res, next) => {
  try {
    logRequestVerbose(req);
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
      next(err);
  }
})

gradesRouter.get('/average', async (req, res, next) => { 
  try {
    logRequestVerbose(req);
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
      next(err);
  }
})

gradesRouter.get('/top3', async (req, res, next) => { 
  try {
    logRequestVerbose(req);
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
      next(err);
  }
})

gradesRouter.get('/:id', async (req, res, next) => {
  try {
    logRequestVerbose(req);
    const gradesFile = await readFile(global.fileName);
    const gradesData = JSON.parse(gradesFile);

    const grade = gradesData.grades.find(
      grade => grade.id === parseInt(req.params.id));

    if (!grade) throw new Error('id não existe');

    res.send(grade);
  } catch(err) {
      next(err);
  }
})

// Tratamento de erro, gravação de log
gradesRouter.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
})

export default gradesRouter;