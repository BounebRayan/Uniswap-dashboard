'use client';
import { useState, useEffect } from "react";
import { MyCard } from "./MyCard";
import { RepositoryCard } from "./RepositoryCard";
import { RiUserFollowLine, RiStarLine, RiGitForkFill } from '@remixicon/react';
import ProgressCard from "./ProgressCard";

export default function RepositoriesOverview(props:any){
    const [metrics, setMetrics] = useState<any>();

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const response = await fetch(`/api/metrics?version=${props.version}`);
                const data = await response.json();
                setMetrics(data);
            } catch (error) {
                console.error('Error fetching metrics:', error);
            }
        }
    fetchMetrics();
    }, []);

    return(
        <>
            <div className="font-semibold pl-6 text-2xl my-2 text-[#131A2B]">Repositories Overview</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 px-3">
                <RepositoryCard count={metrics?.stats[0].total_repositories} values={[Math.floor((metrics?.stats[0].total_user_repos / metrics?.stats[0]?.total_repositories)* 100), 100 - Math.floor((metrics?.stats[0]?.total_user_repos / metrics?.stats[0]?.total_repositories)* 100)]} />
                <MyCard color="yellow" icon={<RiStarLine/>} name="Total Stars" count={metrics?.stats[0]?.total_stars} divider="Popular Repositories" data={metrics?.top_starred_repos} type="star"/>
                <MyCard color="green" icon={<RiUserFollowLine/>} name="Total Contributors" count={metrics?.stats[0]?.total_contributors} divider="Top Contributers" data={metrics?.top_contributors} type="contribution"/>
                <div className="flex-col justify-center space-y-2">
                <MyCard color="red" icon={<RiGitForkFill/>} name="Total Forks" count={metrics?.stats[0]?.total_forks}/>
                <ProgressCard closedIssues={metrics?.stats[0]?.total_closed_issues} issues={metrics?.stats[0]?.total_issues} mergedPRs={metrics?.stats[0]?.total_merges} pullRequests={metrics?.stats[0]?.total_pulls}/>
                </div>
            </div>
        </>
    );
}