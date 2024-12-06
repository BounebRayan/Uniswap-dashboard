# Uniswap Dashboard 🦄 (V4 and V3 support)
This web App serves as a tool to monitor and analyze the activity of developers working on Uniswap across GitHub.

## Getting Started

Start the server in dev mode:
npm run dev

## Data flow
Indexing new repositories is done using the indexingrepos.js and indexingv4repos.js scripts, the json result file contains the list of repositories that is fed to the getDatav3.js and getDatav4.js scripts to get their details and stats and saved to sqlite db each.


Lets see if this can trigger a new release
