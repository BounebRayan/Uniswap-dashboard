'use client'
import { useState, useEffect } from "react";
import ContributionCount from "./ContributionCount";
import ContributionRepos from "./ContributionRepos";
import ContributionTime from "./ContributorTime";

export default function DeveloperStats(props: any) {
    const [countData, setCountData] = useState([]);
    const [timeData, setTimeData] = useState([]);
    const [rawData, setRawData] = useState(null); // Initialize rawData as null

    useEffect(() => {
        // Fetch data for the second endpoint
        fetchSecondEndpointData()
            .then(data => {
                setRawData(data); // Save the raw data
                const transformedCountData = transformCountData(data.contributions.value);
                setCountData(transformedCountData);
                const transformedTimeData = transformTimeData(data.contributionTime.value);
                setTimeData(transformedTimeData);
            })
            .catch(error => console.error('Error fetching second endpoint data:', error));
    }, []);

    // Function to fetch data from the second endpoint
    async function fetchSecondEndpointData() {
        // Make the fetch request to the second endpoint
        const response = await fetch(`/api/getContributorsStats?version=${props.version}`);
        const data = await response.json();
        return data;
    }

    const transformCountData = (data: any) => {
        return data.map((item: { contribution_category: any; contributor_count: any; }) => ({
            name: item.contribution_category,
            sales: item.contributor_count
        }));
    };

    const transformTimeData = (data: any) => {
        return data.map((item: { contribution_interval: any; contributor_count: any; }) => ({
            name: item.contribution_interval,
            sales: item.contributor_count
        }));
    };

    if (!rawData) {
        return null; // Render nothing if rawData is null
    }

    return (
        <>
            <div className="font-semibold pl-6 text-2xl mt-2 mb-2 text-[#131A2B]">Contributor Insights</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4">
                <ContributionCount data={countData} />
                <ContributionRepos rawData={rawData} />
                <ContributionTime data={timeData} />
            </div>
        </>
    );
}
