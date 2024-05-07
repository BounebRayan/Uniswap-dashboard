const { Octokit } = require("octokit");
const sqlite3 = require('sqlite3').verbose();
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

function readJSONFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        return [];
    }
}

const octokit = new Octokit({ 
    auth: process.env.TOKEN
});

async function fetchRepo(keyword) {
    try {
        const response = await octokit.request(`GET /repos/${keyword}`);

        return response.data;
    } catch (error) {
        console.error("Error fetching repositories:", error);
        return [];
    }
}

async function fetchPullsPerPage(fullname, page) {
    try {
        const response = await octokit.request(`GET /repos/${fullname}/pulls`, {
            state : 'all',
            per_page: 100,
            page: page
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching pull requests:", error);
        return [];
    }
}

async function getAllPulls(fullname) {
    let createdPulls = 0;
    let closedPulls = 0;
    let mergedPulls = 0;
    let openPulls = 0;
    let pullsCreationDates = "";
    let pullsClosingDates = "";
    let pullsMergingDates = "";
    let pullsCreationDatesArray = [];
    let pullsClosingDatesArray = [];
    let pullsMergingDatesArray = [];
    let page = 1;
    let repositories;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    do {
        repositories = await fetchPullsPerPage(fullname,page);
        createdPulls += repositories.length;
        for (let repo of repositories) {
            if(repo.merged_at) {
                mergedPulls++;
                pullsMergingDates += repo.merged_at + ';';
                pullsMergingDatesArray.push(new Date(repo.merged_at));
            }
            if(repo.state === "closed") {
                closedPulls++;
                pullsClosingDates += repo.closed_at + ';';
                pullsClosingDatesArray.push(new Date(repo.closed_at));
            }
            pullsCreationDates+= repo.created_at + ';';
            pullsCreationDatesArray.push(new Date(repo.created_at));
        }
        page++;
    } while (repositories.length > 0);
    openPulls = createdPulls - closedPulls;
    const pullsLastSixMonths = pullsCreationDatesArray.filter(date => date > sixMonthsAgo).length;
    const mergesLastSixMonths = pullsMergingDatesArray.filter(date => date > sixMonthsAgo).length;


    return{createdPulls,openPulls, closedPulls, mergedPulls, pullsLastSixMonths,
        mergesLastSixMonths, pullsCreationDates, pullsClosingDates, pullsMergingDates};
}

async function fetchIssuesPerPage(fullname, page) {
    try {
        const response = await octokit.request(`GET /repos/${fullname}/issues`, {
            state : 'all',
            per_page: 100,
            page: page
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching issues:", error);
        return [];
    }
}

async function getAllIssues(fullname) {
    let allIssues = 0;
    let issuesCreationDates = "";
    let closedIssues = 0;
    let issuesClosingDates = "";
    let issuesCreationDatesArray = [];
    let issuesClosingDatesArray = [];
    let openIssues = 0;
    let page = 1;
    let issuesData;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    do {
        issuesData = await fetchIssuesPerPage(fullname, page);
        allIssues += issuesData.length;
        for (let issue of issuesData) {
            if (issue.state === "closed") {
                closedIssues++;
                issuesClosingDates += issue.closed_at + ";";
                issuesClosingDatesArray.push(new Date(issue.closed_at));
            }
            issuesCreationDates += issue.created_at + ";";
            issuesCreationDatesArray.push(new Date(issue.created_at));
        }
        page++;
    } while (issuesData.length > 0);
    openIssues = allIssues - closedIssues;
    const issuesLastSixMonths = issuesCreationDatesArray.filter(date => date > sixMonthsAgo).length;

    return { allIssues, openIssues, closedIssues, issuesCreationDates, issuesClosingDates, issuesLastSixMonths };
}

async function fetchCommitsPerPage(fullname, page) {
    try {
        const response = await octokit.request(`GET /repos/${fullname}/commits`, {
            per_page: 100,
            page: page
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching commits:", error);
        return [];
    }
}

async function getAllCommits(fullname) {
    let commits = 0;
    let dates = "";
    let datesArray = [];
    let commitsLastSixMonths=0;
    let latestCommitDate="";
    let page = 1;
    let commitsData;
    let committers = new Set();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    do {
        commitsData = await fetchCommitsPerPage(fullname, page);
        if ( page === 1 && commitsData.length > 0 && commitsData[0].commit && commitsData[0].commit.author) {
            latestCommitDate = commitsData[0].commit.author.date;
        }
        commits += commitsData.length;
        for (let commit of commitsData) {
            if (commit.author && commit.author.login) {
                const commitDate = new Date(commit.commit.author.date);
                if (commitDate > sixMonthsAgo) {
                    commitsLastSixMonths++;
                }
                committers.add(commit.author.login);
                dates += commit.commit.author.date + ";";
                datesArray.push(commitDate);
            }
        }
        page++;
    } while (commitsData.length > 0);

    return { commits, dates , latestCommitDate, commitsLastSixMonths, uniqueCommitters: committers.size };
}

async function scrapeRepositoryDetails(htmlUrl) {
    try {
        const response = await axios.get(htmlUrl);
        const $ = cheerio.load(response.data);

        const contributorCount = parseInt($('a[href$="/graphs/contributors"] span.Counter').text()) ? parseInt($('a[href$="/graphs/contributors"] span.Counter').text()) : 0 ;

        return contributorCount;
    } catch (error) {
        console.error("Error scraping repository details:", error);
        return null;
    }
}

async function initializePullsTable(db) {
    return new Promise(function(resolve,reject){db.run(`CREATE TABLE IF NOT EXISTS pulls (
        id INTEGER PRIMARY KEY,
        date DATE,
        type TEXT,
        actor TEXT,
        repo_name TEXT
    )`,function(err){
        if(err){return reject(err);}
        resolve();
      });});
}

function savePullsToDatabase(pulls, db) {
    const stmt = db.prepare(`INSERT INTO pulls (repo_name , date, type, actor) VALUES (?, ?, ?, ?)`);
    for (const pull of pulls) {
        stmt.run(pull.pull_repo, pull.pull_date, pull.pull_type, pull.contributor);
    }
    stmt.finalize();
}

async function initializeIssuesTable(db) {
    return new Promise(function(resolve,reject){db.run(`CREATE TABLE IF NOT EXISTS issues (
        id INTEGER PRIMARY KEY,
        repo_name TEXT,
        date DATE,
        type TEXT,
        actor TEXT
    )`,function(err){
        if(err){return reject(err);}
        resolve();
      });});
}

function saveIssueToDatabase(issues, db) {
    const stmt = db.prepare(`INSERT INTO issues (repo_name , date, type, actor) VALUES (?, ?, ?, ?)`);
    for (const issue of issues) {
        //console.log(issue.issue_date);
        stmt.run(issue.issue_repo, issue.issue_date, issue.issue_type, issue.contributor);
    }
    stmt.finalize();
}

// Initialize the contributions table
async function initializeContributionsTable(db) {
    return new Promise(function(resolve,reject){db.run(`CREATE TABLE IF NOT EXISTS contributions (
        id INTEGER PRIMARY KEY,
        date DATE,
        repo_name TEXT,
        contributor TEXT
    )`,function(err){
        if(err){return reject(err);}
        resolve();
      });});
}

// Save contributions to the database
function saveContributionsToDatabase(contributions, db) {
    const stmt = db.prepare(`INSERT INTO contributions (date, repo_name, contributor) VALUES (?, ?, ?)`);
    for (const contribution of contributions) {
        stmt.run(contribution.contribution_date, contribution.contributions_repo, contribution.contributor);
    }
    stmt.finalize();
}

function initializeDatabase(db)  {
    return new Promise(function(resolve,reject){
    db.run(`CREATE TABLE IF NOT EXISTS repositories (
        fullname TEXT PRIMARY KEY,
        html_url TEXT,
        description TEXT,
        homepage TEXT,
        owner_type TEXT,
        created_at TEXT,
        updated_at TEXT,
        forks INTEGER,
        is_fork INTEGER,
        watchers INTEGER,
        stars INTEGER,
        commits INTEGER,
        latest_commit TEXT,
        unique_committers INTEGER,
        pulls INTEGER,
        open_pulls INTEGER,
        merges INTEGER,
        closed_pulls INTEGER,
        issues INTEGER,
        open_issues INTEGER,
        closed_issues INTEGER,
        contributors INTEGER
    )`,function(err){
        if(err){return reject(err);}
        resolve();
      });});
};

function clearTables() {
    try {
        fs.unlinkSync('repositories4.db');
        console.log('File deleted successfully!');
    } catch (err) {
        console.error('No file');
    }
}

function saveToDatabase(repositories,db) {
    const stmt = db.prepare(`INSERT OR REPLACE INTO repositories VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    for (const repoDetails of repositories){
    stmt.run(
        repoDetails.fullname,
        repoDetails.html_url,
        repoDetails.description,
        repoDetails.homepage,
        repoDetails.owner_type,
        repoDetails.created_at,
        repoDetails.updated_at,
        repoDetails.forks,
        repoDetails.is_fork,
        repoDetails.watchers,
        repoDetails.stars,
        repoDetails.commits,
        repoDetails.latest_commit,
        repoDetails.uniqueCommitters,
        repoDetails.createdPulls,
        repoDetails.open_pulls,
        repoDetails.mergedPulls,
        repoDetails.closed_pulls,
        repoDetails.allIssues,
        repoDetails.open_issues,
        repoDetails.closed_issues,
        repoDetails.contributors
    );
    }
    stmt.finalize();
}

//

async function fetchContributions(fullname) {
    try {
        let contributions = [];
        let page = 1;

        while (true) {
            const commitslistperrepo = await fetchCommitsPerPage(fullname, page);
            if (commitslistperrepo.length === 0) {
                break; // No more commits to fetch, exit the loop
            }
            for (let commit of commitslistperrepo) {
                if (commit.author && commit.author.login) {
                const commitDate = new Date(commit.commit.author.date);
                const contribution = { contribution_date: commitDate, contributions_repo: fullname, contributor: commit.author.login };
                contributions.push(contribution);
                }
            }
            page++;
        }
        return contributions;
    } catch (error) {
        console.error("Error fetching contributions:", error);
        return [];
    }
}

async function fetchpulls(fullname) {
    try {
        let pulls = [];
        let page = 1;

        while (true) {
            const list = await fetchPullsPerPage(fullname, page);
            if (list.length === 0) {
                break;
            }
            for (let event of list) {
                const opendate = new Date(event.created_at);
                const closedate = new Date(event.closed_at);
                const mergedate = new Date(event.merged_at);
                owner = event.user.login;
                const pullseventopen = { pull_repo: fullname, pull_date: opendate, pull_type: "open", contributor: owner };
                pulls.push(pullseventopen);
                if(event.closed_at != null) {const pullseventclose = { pull_repo: fullname, pull_date: closedate, pull_type: 'close', contributor: owner };
                pulls.push(pullseventclose);}
                if(event.merged_at !=null) {const pullseventmerge = { pull_repo: fullname, pull_date: mergedate, pull_type: "merge", contributor: owner };
                pulls.push(pullseventmerge);}
            }
            page++;
        }
        return pulls;
    } catch (error) {
        console.error("Error fetching contributions:", error);
        return [];
    }
}

async function fetchissues(fullname) {
    try {
        let issues = [];
        let page = 1;

        while (true) {
            const list = await fetchIssuesPerPage(fullname, page);
            if (list.length === 0) {
                break;
            }
            for (let issue of list) {
                const opendate = new Date(issue.created_at);
                const closedate = new Date(issue.closed_at);
                const updatedate = new Date(issue.updated_at);
                owner = issue.user.login;
                const issueeventopen = { issue_repo: fullname, issue_date: opendate, issue_type: "open", contributor: owner };
                issues.push(issueeventopen);
                if(issue.closed_at!=null) { const issueeventclose = { issue_repo: fullname, issue_date: closedate, issue_type: 'close', contributor: owner };
                issues.push(issueeventclose);}
                if(issue.updated_at != null) {const issueeventupdate = { issue_repo: fullname, issue_date: updatedate, issue_type: "update", contributor: owner };
                issues.push(issueeventupdate);}
            }
            page++;
        }
        return issues;
    } catch (error) {
        console.error("Error fetching contributions:", error);
        return [];
    }
}

async function fetchAllData(keyword) {
    const repo = await fetchRepo(keyword);
    const pulls = await getAllPulls(keyword);
    const issues = await getAllIssues(keyword);
    const commits = await getAllCommits(keyword);
    const contributors = await scrapeRepositoryDetails(repo.html_url);

    myrepotosave={
        fullname: repo.full_name,
        html_url: repo.html_url,
        description : repo.description,
        homepage: repo.homepage,
        owner_type : repo.owner.type,
        created_at : repo.created_at,
        updated_at : repo.updated_at,
        forks : repo.forks,
        is_fork : repo.fork,
        watchers : repo.subscribers_count,
        stars : repo.stargazers_count,
        commits : commits.commits,
        latestCommitDate: commits.latestCommitDate, 
        commitsLastSixMonths: commits.commitsLastSixMonths, 
        uniqueCommitters: commits.uniqueCommitters,
        latest_commit : commits.latestCommitDate,
        open_pulls : pulls.openPulls,
        closed_pulls : pulls.closedPulls,
        pullsLastSixMonths: pulls.pullsLastSixMonths,
        mergesLastSixMonths: pulls.mergesLastSixMonths,
        mergedPulls : pulls.mergedPulls,
        createdPulls : pulls.createdPulls,
        allIssues: issues.allIssues,
        open_issues : issues.openIssues,
        closed_issues : issues.closedIssues,
        issuesLastSixMonths : issues.issuesLastSixMonths,
        contributors : contributors
    }

    return(myrepotosave);
}

async function fetchAllDataForRepositories(repositories) {
    let repos = [];
    let contributions = [];
    let pulls = [];
    let issues = [];
    for (const repo of repositories) {
        const keyword = repo.full_name;
        if (!keyword) {
            console.error("Repository must have 'full_name' property.");
            continue;
        }
        let repoData = await fetchAllData(keyword);
        const contributionsData = await fetchContributions(keyword);
        const pullsData = await fetchpulls(keyword);
        const issueData = await fetchissues(keyword);
        repos.push(repoData);
        contributions.push(...contributionsData);
        issues.push(...issueData);
        pulls.push(...pullsData);
        console.log(repo.full_name);
    }
    clearTables();
    const db = new sqlite3.Database('repositories4.db');
    await initializeDatabase(db);
    await initializeContributionsTable(db);
    await initializeIssuesTable(db);
    await initializePullsTable(db);
    saveIssueToDatabase(issues,db);
    savePullsToDatabase(pulls,db);
    saveToDatabase(repos, db);
    saveContributionsToDatabase(contributions, db); 
}

const repositories = readJSONFile('repositories4.json');
fetchAllDataForRepositories(repositories);