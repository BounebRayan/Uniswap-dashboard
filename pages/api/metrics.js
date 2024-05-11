import sqlite3 from 'sqlite3';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
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

    // Fetch top contributors
    const topContributorsQuery = `
      SELECT 
        contributor as name,
        count(*) as value
      FROM contributions group by contributor
      ORDER BY count(*) Desc
      LIMIT 3
    `;
    const topContributors = await executeQuery(topContributorsQuery);

    // Fetch top starred repositories
    const topStarredReposQuery = `
      SELECT 
        fullname as name, 
        stars as value
      FROM repositories 
      ORDER BY stars DESC 
      LIMIT 3
    `;
    const topStarredRepos = await executeQuery(topStarredReposQuery);

    const contributorsQuery = `SELECT COUNT(Distinct(contributor)) AS contributors_count FROM contributions`;
    const contributorsResult = await executeQuery(contributorsQuery);

    // Fetch other metrics
    const statsQuery = `
      SELECT 
        COUNT(*) AS total_repositories,
        SUM(contributors) AS total_contributors,
        SUM(stars) AS total_stars,
        SUM(watchers) AS total_watchers,
        SUM(issues) AS total_issues,
        Sum(closed_issues) as total_closed_issues,
        SUM(pulls) AS total_pulls,
        SUM(forks) As total_forks,
        SUM(merges) AS total_merges,
        SUM(CASE WHEN owner_type = 'User' THEN 1 ELSE 0 END) AS total_user_repos,
        SUM(CASE WHEN owner_type = 'Organization' THEN 1 ELSE 0 END) AS total_org_repos
      FROM repositories
    `;
    const stats = await executeQuery(statsQuery);

    const metrics = {
      top_contributors: topContributors,
      total_contributors: contributorsResult[0].contributors_count,
      top_starred_repos: topStarredRepos,
      stats: stats
    };

    // Send the metrics as JSON response
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    // Close the database connection
    await db.close();
  }
}
