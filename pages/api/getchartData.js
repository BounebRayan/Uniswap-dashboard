import sqlite3 from 'sqlite3';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const version = req.query.version ? req.query.version : "4";
  // Open the SQLite database
  let db = new sqlite3.Database('repositories'+version+'.db');

  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed in JavaScript

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Initialize the data array
    const data = [];

    // Function to execute SQL query and return a promise
    const executeQuery = (query) => {
      return new Promise((resolve, reject) => {
        db.get(query, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    };

    // Loop through each month in the last year
    for (let i = 0; i < 12; i++) {
      const year = currentMonth - i <= 0 ? currentYear - 1 : currentYear;
      const month = currentMonth - i <= 0 ? currentMonth - i + 12 : currentMonth - i;

      // Define the time period filter for the current month
      const monthStart = new Date(year, month - 1, 1).getTime();
      const monthEnd = new Date(year, month, 0).getTime();
      const timeFilter = `WHERE date >= ${monthStart} AND date <= ${monthEnd}`;

      // Fetch contributions count for the current month
      const contributionCount = await executeQuery(`SELECT COUNT(*) AS contribution_count FROM contributions ${timeFilter}`);

      // Fetch contributions count for the current month
      const contributors = await executeQuery(`SELECT COUNT(DISTINCT(contributor)) AS contributors_count FROM contributions ${timeFilter}`);
      
      // Fetch pull requests count for the current month
      const pullRequestCount = await executeQuery(`SELECT COUNT(*) AS pull_request_count FROM pulls ${timeFilter}`);
      
      // Fetch merged pull requests count for the current month
      const mergedPullRequestCount = await executeQuery(`SELECT COUNT(*) AS merged_pull_request_count FROM pulls ${timeFilter} AND type = 'merge'`);
      
      // Fetch issues opened count for the current month
      const issuesOpenedCount = await executeQuery(`SELECT COUNT(*) AS issues_opened_count FROM issues ${timeFilter} AND type = 'open'`);
      
      // Fetch issues closed count for the current month
      const issuesClosedCount = await executeQuery(`SELECT COUNT(*) AS issues_closed_count FROM issues ${timeFilter} AND type = 'close'`);
      
      // Add data for the current month to the data array
      data.unshift({
        date: `${monthNames[month - 1]} ${year}`, 
        Contributions: contributionCount.contribution_count || 0,
        Contributors: contributors.contributors_count || 0,
        'Pull Requests Opened': pullRequestCount.pull_request_count || 0,
        'Pull Requests Merged': mergedPullRequestCount.merged_pull_request_count || 0,
        'Issues Opened': issuesOpenedCount.issues_opened_count || 0,
        'Issues Closed': issuesClosedCount.issues_closed_count || 0
      });
    }

    // Send the data as JSON response
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    // Close the database connection
    await db.close();
  }
}
