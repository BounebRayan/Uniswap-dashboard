import DonatCard from "./DonatCard";

const data = [
    { name: 'v4', value: 456 },
    { name: 'v3', value: 351 },
    { name: 'v2', value: 351 },
  ];

export default function RepositoriesCategories(props:any){
    return(
        <>
            <div className="font-semibold pl-6 text-2xl mt-2 mb-2 text-[#131A2B]">Repositories Categories</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-3">
                <DonatCard name="Protocol version distrubtion" data={data} categories={['v4','v3', 'v2']} colors={['indigo', 'teal','rose']}/>
                <DonatCard name="Tech stack" data={data} categories={['Foundry','Hardhat', 'other']} colors={['indigo', 'rose','blue']}/>
                <DonatCard name="Integration type" data={data} categories={['Hook','periphery', 'other']} colors={['indigo', 'cyan','teal']}/>
            </div>
        </>
    );
}