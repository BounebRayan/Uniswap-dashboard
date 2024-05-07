import { RiGitRepositoryLine } from "@remixicon/react";
import { Card, Divider, CategoryBar, Legend } from "@tremor/react";

export function RepositoryCard(props:any) {
    return (
        <Card className="mx-auto max-w-md relative" decoration="top" decorationColor="indigo">
            <div className="absolute top-6 right-5 text-tremor-content"><RiGitRepositoryLine/></div>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Total Repositories</p>
            <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">{props.count}</p>
            <Divider>Owner Types %</Divider>
            <CategoryBar className="mt-6 min-w-full" values={props?.values} colors={['indigo', 'cyan']}/>
            <Legend className="mt-4 max-w-32" categories={['Users', 'Organisations']} colors={['indigo', 'cyan']}/>
        </Card>
    );
}