import sqlite3 from 'sqlite3';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const version = req.query.version ? req.query.version : "4";
  // Open the SQLite database
  let db = new sqlite3.Database('repositories'+version+'.db');

  try {
    const { timePeriod } = req.query;

    // Define the time period filter based on the query parameter
    let timeFilter = '';
    const currentDate = new Date().getTime();
    switch (timePeriod) {
      case 'all':
        timeFilter = '';
        break;
      case 'last_six_months':
        timeFilter = `WHERE date >= ${currentDate - 15778800000}`; // 6 months in milliseconds
        break;
      case 'last_three_months':
        timeFilter = `WHERE date >= ${currentDate - 7889400000}`; // 3 months in milliseconds
        break;
      case 'last_month':
        timeFilter = `WHERE date >= ${currentDate - 2629746000}`; // 1 month in milliseconds
        break;
      case 'last_year':
        timeFilter = `WHERE date >= ${currentDate - 31556952000}`; // 1 year in milliseconds
        break;
      default:
        timeFilter = '';
    }
    const currentDate2 = new Date();
    let timeFilter2 = '';
    switch (timePeriod) {
      case 'all':
        timeFilter2 = '';
        break;
      case 'last_six_months':
        timeFilter2 = `WHERE created_at >= ${currentDate2 - 15778800000}`; // 6 months in milliseconds
        break;
      case 'last_three_months':
        timeFilter2 = `WHERE created_at >= ${currentDate - 7889400000}`; // 3 months in milliseconds
      break;
      case 'last_month':
        timeFilter2 = `WHERE created_at >= ${currentDate2 - 2629746000}`; // 1 month in milliseconds
        break;
      case 'last_year':
        timeFilter2 = `WHERE created_at >= ${currentDate - 31556952000}`; // 1 year in milliseconds
        break;
      default:
        timeFilter2 = '';
    }

    // Function to execute SQL query and return a promise
    const executeQuery = (query) => {
      return new Promise((resolve, reject) => {
        db.get(query, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    };

    // Fetch contribution count
    const contributionQuery = `SELECT COUNT(*) AS contribution_count FROM contributions ${timeFilter}`;
    const contributionResult = await executeQuery(contributionQuery);

    // Fetch contribution count
    const contributorsQuery = `SELECT COUNT(Distinct(contributor)) AS contributors_count FROM contributions ${timeFilter}`;
    const contributorsResult = await executeQuery(contributorsQuery);

    // Fetch contribution count
    const ReposQuery = `SELECT COUNT(*) AS repo_count FROM repositories ${timeFilter2}`;
    const ReposResult = await executeQuery(ReposQuery);
    console.log(ReposResult);

    // Fetch pull requests count
    const pullQuery = `SELECT 
      SUM(CASE WHEN type = 'open' THEN 1 ELSE 0 END) AS open_pulls,
      SUM(CASE WHEN type = 'merge' THEN 1 ELSE 0 END) AS merged_pulls,
      SUM(CASE WHEN type = 'close' THEN 1 ELSE 0 END) AS closed_pulls
      FROM pulls ${timeFilter}`;
    const pullResult = await executeQuery(pullQuery);

    // Fetch issues count
    const issueQuery = `SELECT 
      SUM(CASE WHEN type = 'open' THEN 1 ELSE 0 END) AS open_issues,
      SUM(CASE WHEN type = 'close' THEN 1 ELSE 0 END) AS closed_issues,
      SUM(CASE WHEN type = 'update' THEN 1 ELSE 0 END) AS updated_issues
      FROM issues ${timeFilter}`;
    const issueResult = await executeQuery(issueQuery);

    const metrics = {
      contributions: {
        name: 'Contributions',
        value: contributionResult.contribution_count
      },
      pullRequests: [
        { name: 'Pull Requests', value: pullResult.open_pulls + pullResult.merged_pulls + pullResult.closed_pulls },
        { name: 'Merged PRs', value: pullResult.merged_pulls },
        { name: 'Closed PRs', value: pullResult.closed_pulls }
      ],
      issues: [
        { name: 'Opened Issues', value: issueResult.open_issues },
        { name: 'Closed Issues', value: issueResult.closed_issues },
        { name: 'Updated Issues', value: issueResult.updated_issues }
      ],
      contributors :{
        name :'Contributors',
        value: contributorsResult.contributors_count
      },
      repos :{
        name: 'Repos',
        value: ReposResult.repo_count
      }
    };

    // Send the metrics as JSON response
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    // Close the database connection
    db.close();
  }
}
