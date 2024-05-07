'use client';
import { Card, LineChart } from "@tremor/react";

export default function ActivityTimeline(props:any) {  
  const dataFormatter = (number:number) =>
    `${Intl.NumberFormat('us').format(number).toString()}`;
      
  return(
    <Card className="max-w-2xl">
      <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">Activity Timeline</h3>
      <LineChart
        className="pl-2 h-80 max-w-2xl"
        data={props.data}
        index="date"
        categories={['Contributions','Contributors','Pull Requests Opened','Issues Opened']}
        colors={['indigo','cyan', 'rose','teal']}
        valueFormatter={dataFormatter}
        yAxisWidth={60}
        onValueChange={(v) => console.log(v)}
      />
    </Card>
  );
}