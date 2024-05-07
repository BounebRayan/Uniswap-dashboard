"use client";
import { Card, DonutChart, Legend } from "@tremor/react";

export default function DonatCard(props:any){
    const dataFormatter = (number: number) => `${Intl.NumberFormat('us').format(number).toString()}`;

    return(
        <Card className="mx-auto max-w-2xl">
            <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mb-3">{props.name}</h3>
            <div className="flex justify-between items-center">
                <DonutChart
                    data={props.data}
                    colors={props.colors}
                    variant="pie"
                    valueFormatter={dataFormatter}
                    onValueChange={(v) => console.log(v)}
                />
                <Legend
                    className="mt-4 max-w-20"
                    categories={props.categories}
                    colors={props.colors}
                />
            </div>
        </Card>
    );
}