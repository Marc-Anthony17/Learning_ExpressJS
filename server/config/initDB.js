import db from './db.js';

const createTodosTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS todos (
      id VARCHAR(255) PRIMARY KEY,
      date_posted VARCHAR(255),
      text TEXT,
      completed BOOLEAN DEFAULT false,
      priority ENUM('Low', 'Medium', 'High') DEFAULT 'Low',
      starred BOOLEAN DEFAULT false
    )
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error creating todos table:", err);
    } else {
      console.log("✅ 'todos' table ready.");
    }
  });
};

export default createTodosTable;
