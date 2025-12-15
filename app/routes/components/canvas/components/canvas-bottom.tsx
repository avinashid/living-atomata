import { Checkbox } from "~/components/ui/checkbox";
import { useAppState } from "~/routes/state/app-state";
import { useMouseState } from "~/routes/state/mouse-state";
import RandomModel from "./random-model";
import { useRandomGridState } from "~/routes/state/random-grid-state";
import { useGrid } from "~/routes/state/grid-state";

const CanvasBottom = () => {
  const grid = useAppState((e) => e.grid);
  const initialSize = useAppState((e) => e.initialGrid.cell.length);
  const hover = useMouseState((e) => e.hoverActive);
  const changeMouseState = useMouseState((e) => e.updateMouseState);
  const click = useMouseState((e) => e.clickActive);
  const resetRandom = useRandomGridState((e) => e.resetRandom);
  const resetGrid = useGrid((e) => e.replaceGrid);
  return (
    <div className="flex justify-between w-full mt-1">
      <div className="flex gap-2">
        <p className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-semibold">
          Size: {grid.gridSize.x} x {grid.gridSize.y}
        </p>
        <p className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-semibold">
          Cell: {grid.cellSize.x} x {grid.cellSize.y} ({initialSize})
        </p>
        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-semibold flex items-center gap-1">
          <Checkbox
            checked={hover}
            onCheckedChange={() => changeMouseState({ hoverActive: !hover })}
          />
          <p>Hover</p>
        </div>
        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-semibold flex items-center gap-1">
          <Checkbox
            checked={click}
            onCheckedChange={() => changeMouseState({ clickActive: !click })}
          />
          <p>Click</p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <RandomModel />
        <div
          onClick={resetRandom}
          className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-semibold flex items-center gap-1 hover:bg-muted/80 cursor-pointer"
        >
          Remove Random
        </div>
        <div
          onClick={() => {
            resetGrid([]);
          }}
          className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-semibold flex items-center gap-1 hover:bg-muted/80 cursor-pointer"
        >
          Reset
        </div>
      </div>
    </div>
  );
};

export default CanvasBottom;
