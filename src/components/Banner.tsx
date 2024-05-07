// Banner element
export default function Banner() {
  return (
      <div className=" bg-[#131A2B] px-6 py-3">
        <div className=" font-semibold text-white  text-tremor-metric ">
          The Uniswap Dashboard 🦄
        </div>
        <p className="mt-1 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          A tool to monitor and analyze the activity of developers working on Uniswap across GitHub.
        </p>
      </div>
  );
}