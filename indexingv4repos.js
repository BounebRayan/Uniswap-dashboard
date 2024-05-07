const { Octokit } = require("octokit");
const fs = require("fs").promises;
require('dotenv').config();

const octokit = new Octokit({ 
    auth: process.env.TOKEN
});

async function fetchPages(keyword, page = 1) {
    try {
        const response = await octokit.request("GET /search/code", {
            q:  `${keyword} filename:.gitmodules`,
            sort: "stars",
            order: "desc",
            per_page: 100,
            page: page
        });

        return response.data.items;
    } catch (error) {
        console.error("Error fetching repositories:", error);
        return [];
    }
}

async function searchAndSaveForTimePeriod(keyword) {
    const allRepositories = [];
    let page = 1;
    let repositories;

    do {
        repositories = await fetchPages(keyword, page);
        repositories = repositories.filter(repo => {
            const fullName = repo.repository.full_name.toLowerCase();
            return !fullName.startsWith("uniswap") && !fullName.startsWith("uniswapfoundation");});
        allRepositories.push(...repositories);
        page++;
    } while (repositories.length > 0);

    // Extracting relevant information and creating an array of objects
    const repoInfo = allRepositories.map(repo => ({
        full_name: repo.repository.full_name,
        url: repo.repository.html_url
    }));

    // Writing the array to a JSON file
    try {
        await fs.writeFile('repositories4.json', JSON.stringify(repoInfo, null, 2));
        console.log('Repository information saved to repositories.json');
    } catch (error) {
        console.error('Error saving repository information:', error);
    }
}

searchAndSaveForTimePeriod('lib/v4-core');
