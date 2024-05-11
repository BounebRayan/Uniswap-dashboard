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
      case 'last_month':
        timeFilter = `WHERE date >= ${currentDate - 2629746000}`; // 1 month in milliseconds
        break;
      case 'last_year':
        timeFilter = `WHERE date >= ${currentDate - 31556952000}`; // 1 year in milliseconds
        break;
      default:
        timeFilter = '';
    }

    // Function to execute SQL query and return a promise
    const executeQuery = (query) => {
      return new Promise((resolve, reject) => {
        db.all(query, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    };

    // Fetch contribution count
    // Fetch contribution count
const contributionsCountQuery = `
SELECT
  CASE
      WHEN contributions_count = 1 THEN 'Exactly One Contribution'
      WHEN contributions_count < 10 THEN 'Two to Ten Contributions'
      WHEN contributions_count < 50 THEN 'Ten to Fifty Contributions'
      WHEN contributions_count < 100 THEN 'Fifty to a Hundred Contributions'
      ELSE 'More than a Hundred Contributions'
  END AS contribution_category,
  COUNT(*) AS contributor_count
FROM (
    SELECT
        contributor,
        COUNT(*) AS contributions_count
    FROM
        contributions
    ${timeFilter}
    GROUP BY
        contributor
) AS contributors_with_contribution_count
GROUP BY
    contribution_category
ORDER BY
    CASE
        WHEN contribution_category = 'Exactly One Contribution' THEN 1
        WHEN contribution_category = 'Two to Ten Contributions' THEN 2
        WHEN contribution_category = 'Ten to Fifty Contributions' THEN 3
        WHEN contribution_category = 'Fifty to a Hundred Contributions' THEN 4
        WHEN contribution_category = 'More than a Hundred Contributions' THEN 5
        ELSE 6
    END;
`;

    const contributionsCountResult = await executeQuery(contributionsCountQuery);

    // Fetch contribution time difference
    const contributionTimeIntervalQuery = `
    SELECT
        CASE
            WHEN (contributions_last - contributions_first) < 864000000 THEN 'Less Than A Day'
            WHEN (contributions_last - contributions_first) < 6048000000 THEN 'A Day To A Week'
            WHEN (contributions_last - contributions_first) < 25920000000 THEN 'A Week To A Month'
            WHEN (contributions_last - contributions_first) < 77760000000 THEN 'One To Three Months'
            WHEN (contributions_last - contributions_first) < 155520000000 THEN 'Three to Six Months'
            ELSE 'More Than Six Months'
        END AS contribution_interval,
        COUNT(*) AS contributor_count
    FROM (
        SELECT
            contributor,
            MIN(date) AS contributions_first,
            CASE
                WHEN COUNT(*) = 1 THEN MIN(date)  -- When there's only one contribution, set both first and last to the same date
                ELSE MAX(date)
            END AS contributions_last
        FROM
            contributions
        ${timeFilter}
        GROUP BY
            contributor
    ) AS contributors_with_time_diff
    GROUP BY
        contribution_interval
    ORDER BY
        CASE
            WHEN contribution_interval = 'Less Than A Day' THEN 1
            WHEN contribution_interval = 'A Day To A Week' THEN 2
            WHEN contribution_interval = 'A Week To A Month' THEN 3
            WHEN contribution_interval = 'One To Three Months' THEN 4
            WHEN contribution_interval = 'Three to Six Months' THEN 5
            ELSE 6
        END;
`;

    const contributionTimeIntervalResult = await executeQuery(contributionTimeIntervalQuery);

    // Fetch average contributions per person
    const averageContributionsQuery = `
      SELECT AVG(contributions_per_person) AS average_contributions_per_person
      FROM (
          SELECT COUNT(*) AS contributions_per_person
          FROM contributions
          ${timeFilter}
          GROUP BY contributor
      ) AS subquery
    `;
    const averageContributionsResult = await executeQuery(averageContributionsQuery);

    // Fetch contribution repository count
    const contributionRepoCountQuery = `
      SELECT
        CASE
            WHEN repo_count = 1 THEN '1 repo'
            WHEN repo_count BETWEEN 2 AND 3 THEN '2-3 repos'
            ELSE '4 or more repos'
        END AS contribution_category,
        COUNT(*) AS contributor_count
      FROM (
          SELECT
              contributor,
              COUNT(DISTINCT repo_name) AS repo_count
          FROM
              contributions
          ${timeFilter}
          GROUP BY
              contributor
      ) AS contributors_with_repo_count
      GROUP BY
          contribution_category;
    `;
    const contributionRepoCountResult = await executeQuery(contributionRepoCountQuery);

    const metrics = {
      contributions: {
        name: "Contributions",
        value: contributionsCountResult
      },
      averageContributions: {
        name: 'Average Contributions',
        value: averageContributionsResult[0].average_contributions_per_person,
      },
      contributionTime: {
        name: "Contribution Time Interval",
        value: contributionTimeIntervalResult
      },
      repositories: {
        name: "Repositories",
        value: contributionRepoCountResult
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
