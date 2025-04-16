import { createConnection } from 'mysql';

/** Enter your own database information */
const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'todo_app', 
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL DB:', err);
    return;
  }
  console.log('Connected to MySQL DB');
});

// Export the query function for use in controllers
export const query = (sql, params, callback) => {
  return db.query(sql, params, callback);
};

export default db;