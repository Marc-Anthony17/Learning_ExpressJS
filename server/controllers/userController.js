import { query } from '../config/db.js';

// GET all todos
export function getTodos(req, res) {
  query('SELECT * FROM todos ORDER BY date_posted DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
}

// POST new todo
export function createTodo(req, res) {
  const { id, date_posted, text, completed, priority, starred } = req.body;
  const sql = 'INSERT INTO todos (id, date_posted, text, completed, priority, starred) VALUES (?, ?, ?, ?, ?, ?)';
  query(sql, [id, date_posted, text, completed, priority, starred], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(req.body);
  });
}

// PUT update todo
export function updateTodo(req, res) {
  const { id } = req.params;
  const fields = req.body;

  const sql = 'UPDATE todos SET ? WHERE id = ?';
  query(sql, [fields, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Todo updated' });
  });
}

// DELETE todo
export function deleteTodo(req, res) {
  const { id } = req.params;
  query('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Todo deleted' });
  });
}
