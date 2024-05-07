import sqlite3 from 'sqlite3';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const version = req.query.version ? req.query.version : "4";
  // Open the SQLite database
  let db = new sqlite3.Database('repositories'+version+'.db');

  try {
    // Define queries to fetch the last three events from each table
    const queries = {
      contributions: `SELECT * FROM contributions ORDER BY date DESC LIMIT 3`,
      pulls: `SELECT * FROM pulls ORDER BY date DESC LIMIT 3`,
      issues: `SELECT * FROM issues ORDER BY date DESC LIMIT 3`
    };

    // Execute queries concurrently
    const results = await Promise.all(Object.values(queries).map(query => executeQuery(db, query)));

    // Organize the results into the desired format
    const data = {
      contributions: results[0],
      pulls: results[1],
      issues: results[2]
    };

    // Send the data as JSON response
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching last events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    // Close the database connection
    await db.close();
  }
}

// Function to execute a SQL query and return the result
function executeQuery(db, query) {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
