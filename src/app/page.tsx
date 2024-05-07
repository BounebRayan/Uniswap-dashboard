import Banner from "@/components/Banner";
import RepositoriesActivities from "@/components/RepositoriesActivities";
import RepositoriesOverview from "@/components/RepositoriesOverview";
import TableComponent from "@/components/tableComponent";
import {
  Card,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';


export default function Home() {
  return (
  <>
    <Banner />
    <TabGroup>
        <TabList defaultValue={1} className="mx-4 mt-0.5">
          <Tab value={1}>v4</Tab>
          <Tab value={2}>v3</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RepositoriesOverview version="4"/>
            <RepositoriesActivities version="4"/>
            <TableComponent version="4"/>
          </TabPanel>
          <TabPanel>
            <RepositoriesOverview version="3"/>
            <RepositoriesActivities version="3"/>
            <TableComponent version="3"/>
          </TabPanel>
        </TabPanels>
    </TabGroup>
  </>
  );
}
