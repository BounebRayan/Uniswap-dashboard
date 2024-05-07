'use client';
import { useState, useEffect } from "react";
import ActivityTimeline from "./ActivityTimeline";
import LatestActivity from "./LatestActivity";
import StatsCard from "./StatsCard";

const defdata2 = [
    {
      date: 'Jan 22',
      Commits: 2890,
      'Pull Requests': 2338,
    },
    {
      date: 'Feb 22',
      Commits: 2756,
      'Pull Requests': 2103,
    },
    {
      date: 'Mar 22',
      Commits: 3322,
      'Pull Requests': 2194,
    },
    {
      date: 'Apr 22',
      Commits: 3470,
      'Pull Requests': 2108,
    },
    {
      date: 'May 22',
      Commits: 3475,
      'Pull Requests': 1812,
    },
    {
      date: 'Jun 22',
      Commits: 3129,
      'Pull Requests': 1726,
    },
    {
      date: 'Jul 22',
      Commits: 3490,
      'Pull Requests': 1982,
    },
    {
      date: 'Aug 22',
      Commits: 2903,
      'Pull Requests': 2012,
    },
    {
      date: 'Sep 22',
      Commits: 2643,
      'Pull Requests': 2342,
    },
    {
      date: 'Oct 22',
      Commits: 2837,
      'Pull Requests': 2473,
    },
    {
      date: 'Nov 22',
      Commits: 2954,
      'Pull Requests': 3848,
    },
    {
      date: 'Dec 22',
      Commits: 3239,
      'Pull Requests': 3736,
    },
];

export default function RepositoriesActivities(props:any){

  const [data2, setData2] = useState([]);

  useEffect(() => {

      // Fetch data for the second endpoint
      fetchSecondEndpointData()
          .then(data => setData2(data))
          .catch(error => console.error('Error fetching second endpoint data:', error));
  }, []);

  // Function to fetch data from the second endpoint
  async function fetchSecondEndpointData() {
      // Make the fetch request to the second endpoint
      const response = await fetch(`/api/getchartData?version=${props.version}`);
      const data = await response.json();
      return data;
  }

    return(
        <>
            <div className="font-semibold pl-6 text-2xl mt-2 mb-2 text-[#131A2B]">Repositories Activities</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4">
            <StatsCard version={props.version}/>
            {data2 && <ActivityTimeline data={data2 || defdata2} />}
            <LatestActivity version={props.version}/>
            </div>
        </>
    );
}