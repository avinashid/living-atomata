import { use, useMemo, type ReactNode } from "react";
import { useAppState } from "../../state/app-state";
import { useGrid } from "../../state/grid-state";
import { CanvasGrid } from "./components/canvas-grid";
import CanvasBottom from "./components/canvas-bottom";

const CanvasLayout = (props: { title: ReactNode; children?: ReactNode }) => {
  const cellSize = useAppState(
    (e) =>
      (e.grid.gridSize.x / e.grid.cellSize.x) *
      (e.grid.gridSize.y / e.grid.cellSize.y)
  );
  const initial = useAppState((e) => e.initialGrid.cell);
  const parsedInitial = useMemo(
    () => (cellSize > 25000 ? [] : initial),
    [cellSize]
  );
  const grid = useGrid((e) => e.gridCell);

  const points = useMemo(
    () => [...parsedInitial, ...grid],
    [parsedInitial, grid]
  );
  return (
    <div className="grid grid-flow-rows auto-cols-max mx-auto w-fit">
      <div>{props.title}</div>
      <div>{props.children}</div>
      <div className="flex-1">
        <CanvasGrid points={points} className="" />
      </div>
      <CanvasBottom />
    </div>
  );
};

export default CanvasLayout;
