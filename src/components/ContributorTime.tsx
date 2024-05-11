'use client';
import { RiCheckboxCircleLine, RiInformation2Fill, RiInformationLine } from "@remixicon/react";
import { Callout, Card, Divider, DonutChart, Legend} from "@tremor/react";

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
            <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold pb-4">Contribution Span Breakdown</h3>
            <div className="flex">
            <DonutChart
          data={props.data}
          category="sales"
          variant="pie"
          index="name"
          colors={['slate', 'blue', 'indigo', 'violet', 'fuchsia','emerald']}
          className="w-80 mr-3 z-10"
        />
         <Legend
                    categories={props.data.map(item => item.name)}
                    colors={['slate', 'blue', 'indigo', 'violet', 'fuchsia','emerald']}
                    className="max-w-xs w-fit"
                />
        </div>
        <p className="mt-2 text-tremor-default text-tremor-content dark:text-dark-tremor-content"><RiInformationLine className="inline"/> Displays the duration between the earliest and latest contributions made by contributors.</p>

        </Card>
  );
}