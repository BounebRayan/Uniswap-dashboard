'use client';
import { Card, Divider, DonutChart, Legend, List, ListItem} from "@tremor/react";

export default function ContributionRepos(props:any) {  
      
  return(
    <Card>
                    <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Average Contributions Per Contributor</p>
                    <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">{props.rawData.averageContributions.value.toFixed(2)}</p>
                    <Divider>Repositories per contributor</Divider>
                    <List>
                        {/* Check if rawData.repositories exists before accessing its value */}
                        {props.rawData.repositories && (
                            <>
                                <ListItem>
                                    <span>Contribution In Only One Repositories</span>
                                    <span>{props.rawData.repositories.value[0].contributor_count}</span>
                                </ListItem>
                                <ListItem>
                                    <span>Contribution In Two To Three Repositories</span>
                                    <span>{props.rawData.repositories.value[1].contributor_count}</span>
                                </ListItem>
                                <ListItem>
                                    <span>Contribution In Four Or More Repositories</span>
                                    <span>{props.rawData.repositories.value[2].contributor_count}</span>
                                </ListItem>
                            </>
                        )}
                    </List>
                </Card>
    
  );
}