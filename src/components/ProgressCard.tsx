import { Card, ProgressCircle } from '@tremor/react';

export default function ProgressCard(props:any) {
    return (
        <Card className="mx-auto max-w-md gap-2 py-3">
            <div className="flex justify-center space-x-5 items-center">
                <ProgressCircle value={Math.floor((props.closedIssues / props.issues)* 100)} size="md">
                    <span className="text-xs font-medium text-slate-700">{Math.floor((props.closedIssues / props.issues)* 100)}%</span>
                </ProgressCircle>
                <div>
                    <p className="text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">{props.closedIssues}/{props.issues} ({Math.floor((props.closedIssues / props.issues)* 100)}%)</p>
                    <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Closed Issues</p>
                </div>
            </div>
            <div className="flex justify-center space-x-5 items-center mt-4">
                <ProgressCircle value={Math.floor(props.mergedPRs * 100 / props.pullRequests)} size="md">
                    <span className="text-xs font-medium text-slate-700">{Math.floor(props.mergedPRs * 100 / props.pullRequests)}%</span>
                </ProgressCircle>
                <div>
                    <p className="text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">{props.mergedPRs}/{props.pullRequests} ({Math.floor(props.mergedPRs * 100 / props.pullRequests)}%)</p>
                    <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Merged PRs</p>
                </div>
            </div>
        </Card>  
    );
}