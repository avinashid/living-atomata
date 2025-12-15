import { useMemo } from "react";
import { useAppState } from "../../state/app-state";
import { useGrid } from "../../state/grid-state";
import { CanvasGrid } from "./components/canvas-grid";
import CanvasBottom from "./components/canvas-bottom";

const CanvasLayout = () => {
  const initial = useAppState((e) => e.initialGrid.cell);
  const grid = useGrid((e) => e.gridCell);
  const points = useMemo(() => [...initial, ...grid], [initial, grid]);
  return (
    <div className="grid grid-flow-rows auto-cols-max mx-auto w-fit">
      <div>GRID game</div>
      <div className="flex-1">
        <CanvasGrid points={points} className="" />
      </div>
      <CanvasBottom />
    </div>
  );
};

export default CanvasLayout;
