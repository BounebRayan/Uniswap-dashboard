import { Card, Divider, List, ListItem } from "@tremor/react";

export function MyCard(props:any) {
    return (
        <Card className="mx-auto max-w-md relative" decoration="top" decorationColor={props.color}>
            <div className="absolute top-6 right-5  text-tremor-content">
                {props.icon}
            </div>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">{props.name}</p>
            <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">{props.count}</p>
            {props.divider && <><Divider>{props.divider}</Divider>
            <List className="mt-2">
                {props.data?.map((item:any) => (
                    <ListItem key={item.name}>
                        <span>{item.name}</span>
                        <span>{item.value+' '+props.type}</span>
                    </ListItem>
                ))}
            </List></>}
        </Card>
    );
}