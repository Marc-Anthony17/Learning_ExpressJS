// const createTodosTable = require('./config/initDB');
import express, { json } from 'express';
import cors from 'cors';
import todoRoutes from './routes/userRoutes.js';
import createTodosTable from './config/initDB.js';

const app = express();
app.use(cors());
app.use(json());

app.use('/api/todos', todoRoutes);

createTodosTable(); 

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
