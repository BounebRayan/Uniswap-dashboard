'use client';
import { RiInformationLine } from "@remixicon/react";
import { Card, DonutChart, Legend} from "@tremor/react";

interface DataItem {
  name: string;
  // Add other properties if available in your data
}

interface ContributionCountProps {
  data: DataItem[];
}

export default function ContributionCount(props:ContributionCountProps) {  
      
  return(
    <Card className="max-w-2xl">
            <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold pb-4">Contribution Levels</h3>
            <div className="flex">
            <DonutChart
          data={props.data}
          category="sales"
          variant="pie"
          index="name"
          colors={['slate', 'blue', 'indigo', 'violet', 'fuchsia']}
          className="w-72 mr-3 z-10"
        />
         <Legend
                    categories={props.data.map(item => item.name)}
                    colors={['slate', 'blue', 'indigo', 'violet', 'fuchsia']}
                    className="max-w-xs w-fit"
                />
        </div>
        <p className="mt-2 text-tremor-default text-tremor-content dark:text-dark-tremor-content"><RiInformationLine className="inline"/> Displays the number of contributors with a specific level of contribution.</p>
        </Card>
  );
}