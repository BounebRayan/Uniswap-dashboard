const { Octokit } = require("octokit");
const fs = require("fs").promises;
require('dotenv').config();

const octokit = new Octokit({ 
    auth: process.env.TOKEN
});

async function fetchPages(keyword1, keyword2, min, max, page = 1) {
    try {
        const response = await octokit.request("GET /search/code", {
            q:  `${keyword1} OR ${keyword2} filename:package.json size:${min}..${max}`,
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

async function searchAndSaveForTimePeriod(keyword1, keyword2, min, max) {
    const allRepositories = [];
    let page = 1;
    let repositories;

    do {
        repositories = await fetchPages(keyword1, keyword2, min, max, page);
        allRepositories.push(...repositories);
        page++;
        await new Promise(resolve => setTimeout(resolve, 10000));
    } while (repositories.length > 0);

    return allRepositories;
}

async function fetchall(keyword1,keyword2){
    let allRepositories = [];
    let min = 0;
    let max = 2000;

    while( max <= 6000 ){
    let results = await searchAndSaveForTimePeriod(keyword1,keyword2,min,max);
    allRepositories.push(...results);
    min = max;
    max += 2000;
    }
    max = "*";
    let results = await searchAndSaveForTimePeriod(keyword1,keyword2, min, max);
    allRepositories.push(...results);

    allRepositories = allRepositories.filter(repo => {
        const fullName = repo.repository.full_name.toLowerCase();
        return !fullName.startsWith("uniswap") && !fullName.startsWith("uniswapfoundation");});

    allRepositories = allRepositories.filter((repo, index, self) =>
        index === self.findIndex((r) => (
            r.repository.full_name === repo.repository.full_name
        ))
    );

    const repoInfo = allRepositories.map(repo => ({
        full_name: repo.repository.full_name,
        url: repo.repository.html_url
    }));

    try {
        await fs.writeFile('repositories3.json', JSON.stringify(repoInfo, null, 2));
        console.log('Repository information saved to repositories.json');
    } catch (error) {
        console.error('Error saving repository information:', error);
    }

}

fetchall('@uniswap/v3-core','@uniswap/v3-sdk');