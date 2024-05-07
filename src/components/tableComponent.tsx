'use client';
import { Card, Select, SelectItem, Table, TableBody, TableCell, TableHead, TableRow } from "@tremor/react";
import { useState, useEffect } from "react";

export default function TableComponent(props: any) {
  const [data, setData] = useState<any[]>([]);
  const [rowsnumber, setRowsNumber] = useState<string>('10');

  useEffect(() => {
    console.log("ee");
    fetchEndpointData(rowsnumber,props.version)
      .then(data => {
        console.log("Fetched data:", data);
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [rowsnumber]);

  return (
    <Card className="mx-auto max-w-7xl my-6">
      <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">Repositories table</h3>
      <Select className="max-w-xs my-3 tremor-border-black" defaultValue="10" onValueChange={(e) => setRowsNumber(e)}>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="20">20</SelectItem>
        <SelectItem value="50">50</SelectItem>
        <SelectItem value="100">100</SelectItem>
      </Select>
      <Table className="mt-5">
        <TableHead>
          <TableRow className="text-tremor-content-strong font-semibold">
            <TableCell>Repository Name</TableCell>
            <TableCell>HTML URL</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Homepage</TableCell>
            <TableCell>Owner Type</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell>Forks</TableCell>
            <TableCell>Is Fork</TableCell>
            <TableCell>Watchers</TableCell>
            <TableCell>Stars</TableCell>
            <TableCell>Commits</TableCell>
            <TableCell>Latest Commit</TableCell>
            <TableCell>Unique Committers</TableCell>
            <TableCell>Pulls</TableCell>
            <TableCell>Open Pulls</TableCell>
            <TableCell>Merges</TableCell>
            <TableCell>Closed Pulls</TableCell>
            <TableCell>Issues</TableCell>
            <TableCell>Open Issues</TableCell>
            <TableCell>Closed Issues</TableCell>
            <TableCell>Contributors</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.fullname}>
              <TableCell>{item.fullname}</TableCell>
              <TableCell><a href={item.html_url}>{item.html_url}</a></TableCell>
              <TableCell className="w-30">{item.description}</TableCell>
              <TableCell><a href={item.homepage}>{item.homepage}</a></TableCell>
              <TableCell>{item.owner_type}</TableCell>
              <TableCell>{item.created_at}</TableCell>
              <TableCell>{item.updated_at}</TableCell>
              <TableCell>{item.forks}</TableCell>
              <TableCell>{item.is_fork}</TableCell>
              <TableCell>{item.watchers}</TableCell>
              <TableCell>{item.stars}</TableCell>
              <TableCell>{item.commits}</TableCell>
              <TableCell>{item.latest_commit}</TableCell>
              <TableCell>{item.unique_committers}</TableCell>
              <TableCell>{item.pulls}</TableCell>
              <TableCell>{item.open_pulls}</TableCell>
              <TableCell>{item.merges}</TableCell>
              <TableCell>{item.closed_pulls}</TableCell>
              <TableCell>{item.issues}</TableCell>
              <TableCell>{item.open_issues}</TableCell>
              <TableCell>{item.closed_issues}</TableCell>
              <TableCell>{item.contributors}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

async function fetchEndpointData(numRows: string,version: string) {
  try {
    const response = await fetch(`/api/getTable?rows=${numRows}&version=${version}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error:any) {
    throw new Error('Error fetching data:', error);
  }
}
