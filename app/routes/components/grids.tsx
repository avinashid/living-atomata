import type { Cell } from "~/utils/types";
import PointBox from "./point";
import { memo } from "react";

type GridsProps = {
  points: Cell[];
  gridSize: Cell;
  className?: string;
  startKey?: string;
};

export const Grids = memo(function Grids({
  points,
  gridSize,
  className,
  startKey,
}: GridsProps) {
  return (
    <>
      {points.map((p, i) => (
        <PointBox
          key={`${startKey ?? ""}-grid-${p.x}-${p.y}-${i}`}
          location={p}
          size={gridSize}
          className={className}
        />
      ))}
    </>
  );
});
