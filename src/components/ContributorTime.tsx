'use client';
import { Card, DonutChart, Legend} from "@tremor/react";

interface DataItem {
  name: string;
  // Add other properties if available in your data
}

interface ContributionCountProps {
  data: DataItem[];
}

export default function ContributionTime(props:ContributionCountProps) {  
      
  return(
    <Card className="max-w-2xl">
            <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold pb-4">Contribution Duration Breakdown</h3>
            <div className="flex">
            <DonutChart
          data={props.data}
          category="sales"
          variant="pie"
          index="name"
          colors={['blue', 'cyan', 'indigo', 'violet', 'fuchsia','teal']}
          className="w-80 mr-3 z-10"
        />
         <Legend
                    categories={props.data.map(item => item.name)}
                    colors={['blue', 'cyan', 'indigo', 'violet', 'fuchsia','teal']}
                    className="max-w-xs w-fit"
                />
        </div>
        </Card>
  );
}