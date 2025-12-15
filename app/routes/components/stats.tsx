import { useGrid } from "../state/grid-state";

const Stats = () => {
  const initialGrid = useGrid((e) => e.gridCell);

  return (
    <div className="absolute bottom-2 right-8 z-10 bg-black/10 rounded border-md px-4 py-2 border-gray-700  backdrop-blur min-w-xs flex flex-col gap-2">
      <div className="text-lg pb-1 border-b border-gray-800 font-semibold">
        Stats
      </div>

      <div className="divide-x-2 flex gap-2 *:pr-2">
        <div>
          <div className="text-sm font-semibold">Grid</div>
          <div>{initialGrid.length}</div>
        </div>
        <div>
          <div className="text-sm font-semibold">Random</div>
          {initialGrid.filter((e) => e.attribute === "random-box").length}
        </div>
        <div>
          <div className="text-sm font-semibold">Random Tails</div>
          {initialGrid.filter((e) => e.attribute?.startsWith("tail")).length}
        </div>
      </div>
    </div>
  );
};

export default Stats;
