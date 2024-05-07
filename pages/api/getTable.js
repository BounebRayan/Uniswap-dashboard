import sqlite3 from 'sqlite3';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const numRows = req.query.rows ? parseInt(req.query.rows, 10) : 10;
  const version = req.query.version ? req.query.version : "4";
  // Open the SQLite database
  let db = new sqlite3.Database('repositories'+version+'.db');

  try {
    // Function to execute SQL query and return a promise
    const executeQuery = (query) => {
      return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    };

    // Fetch other metrics
    const statsQuery = `
      SELECT *
      FROM repositories order by stars desc limit ${numRows}
    `;
    const stats = await executeQuery(statsQuery);

    // Send the metrics as JSON response
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    // Close the database connection
    await db.close();
  }
}
