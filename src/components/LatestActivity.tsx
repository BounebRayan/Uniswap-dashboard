import { RiCheckboxCircleLine, RiErrorWarningLine, RiGitClosePullRequestLine, RiGitCommitLine, RiGitMergeFill, RiGitPullRequestFill } from '@remixicon/react';
import { Callout, Card, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import { useEffect, useState } from 'react';
import moment from 'moment';
interface Contribution {
  repo_name: string;
  contributor: string;
  date: number;
}

interface PullRequest {
  repo_name: string;
  actor: string;
  type: string;
  date: number;
}

interface Issue {
  repo_name: string;
  actor: string;
  type: string;
  date: number;
}

interface LatestActivityData {
  contributions: Contribution[];
  pulls: PullRequest[];
  issues: Issue[];
}
export default function LatestActivity(props: any) {
  const [data, setData] = useState<any>({ contributions: [], pulls: [], issues: [] });

  useEffect(() => {
    // Fetch data for the first endpoint
    fetchEndpointData(props.version)
      .then(data => setData(data))
      .catch(error => console.error('Error fetching first endpoint data:', error));
  }, []);

    // Function to format the date as "an x hour/day ago"
    const formatTimeAgo = (timestamp: number) => {
      const now = moment();
      const time = moment(timestamp);
      const diff = now.diff(time, 'hours');
  
      if (diff < 24) {
        return `${diff === 1 ? 'hour' : `${diff} hours`} ago`;
      } else {
        const days = Math.floor(diff / 24);
        return `${days === 1 ? 'day' : `${days} days`} ago`;
      }
    };

  return (
    <Card className="mx-auto max-w-2xl">
      <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">Latest Activities</h3>
      <TabGroup>
        <TabList className="mt-4">
          <Tab>Commits</Tab>
          <Tab>Pull Requests</Tab>
          <Tab>Issues</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {data.contributions && data.contributions.map((contribution: any, index: number) => (
              <Callout key={index} className="mt-4" title={contribution.repo_name} icon={RiGitCommitLine} color="teal">
                {contribution.contributor} has committed {formatTimeAgo(contribution.date)}.
              </Callout>
            ))}
          </TabPanel>
          <TabPanel>
          {data.pulls && data.pulls.map((pull: any, index: number) => (
              <Callout key={index} className="mt-4" title={pull.repo_name} icon={pull.type== "close" ? RiGitClosePullRequestLine : pull.type == "open" ? RiGitPullRequestFill : RiGitMergeFill} color={pull.type== "merge" ? "indigo": pull.type == "close" ? "yellow":"teal"}>
                {pull.actor} has {pull.type== "close" ? "closed" : pull.type == "open" ? "opened" : "merged"} a pull request {formatTimeAgo(pull.date)}.
              </Callout>
            ))}
          </TabPanel>
          <TabPanel>
          {data.issues && data.issues.map((issue: any, index: number) => (
              <Callout key={index} className="mt-4" title={issue.repo_name} icon={issue.type== "close" ? RiCheckboxCircleLine : issue.type=="open" ? RiErrorWarningLine : RiErrorWarningLine} color={issue.type== "close"? 'teal':issue.type== "open" ? 'red':'yellow'}>
                {issue.actor} has {issue.type== "close" ? "closed" : issue.type=="open" ? "opened" : "updated"} an issue {formatTimeAgo(issue.date)}.
              </Callout>
            ))}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
}

async function fetchEndpointData(version:string) {
  // Make the fetch request to the third endpoint
  const response = await fetch(`/api/getLatestActivities?version=${version}`);
  const data = await response.json();
  return data;
}
