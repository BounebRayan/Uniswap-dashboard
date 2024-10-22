import { Card, Select, SelectItem, BarList } from "@tremor/react";
import { useState, useEffect } from "react";

export default function StatsCard(props: any) {
  const [data, setData] = useState<any[]>([]);
  const [timePeriod, setTimePeriod] = useState<string>('all');

  useEffect(() => {
    fetchEndpointData(timePeriod,props.version)
      .then(transformData)
      .then(data =>  setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [timePeriod]);

  const transformData = (fetchedData: any) => {
    const transformedData = [
      { name: fetchedData.contributions.name, value: fetchedData.contributions.value },
      ...fetchedData.pullRequests,
      ...fetchedData.issues,
      {name:fetchedData.repos.name,value:fetchedData.repos.value},
      {name:fetchedData.contributors.name,value:fetchedData.contributors.value}
    ];
    return transformedData;
  };

  return (
    <Card className="mx-auto max-w-2xl" >
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Time Period</p>
      <Select defaultValue="5" onValueChange={(e) => setTimePeriod(e)}>
        <SelectItem value="5">All time</SelectItem>
        <SelectItem value="4">Last year</SelectItem>
        <SelectItem value="3">Last six months</SelectItem>
        <SelectItem value="2">Last three months</SelectItem>
        <SelectItem value="1">Last month</SelectItem>
      </Select>
      {data.length > 0 && (
        <BarList data={data} sortOrder="descending" className="mx-auto max-w-xl mt-3" />
      )}
    </Card>
  );
}

async function fetchEndpointData(timePeriod: string,version:string) {
  let url = `/api/getStatsByDate?timePeriod=all&version=${version}`; // Default to all time
  switch (timePeriod) {
    case '1':
      url = `/api/getStatsByDate?timePeriod=last_month&version=${version}`;
      break;
    case '2':
      url = `/api/getStatsByDate?timePeriod=last_three_months&version=${version}`;
      break;
    case '3':
      url = `/api/getStatsByDate?timePeriod=last_six_months&version=${version}`;
      break;
    case '4':
      url = `/api/getStatsByDate?timePeriod=last_year&version=${version}`;
      break;
    default:
      break;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
