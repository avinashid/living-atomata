import { create } from "zustand";
import type { Cell, CellStyle } from "~/utils/types";
import { useGrid } from "../grid-state";
import { useAppState } from "../app-state";
import { Constants } from "~/utils/constants";
import { CellGenerator } from "~/utils/cell-generator";

const NEIGHBORS = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
];
export type ConwayLifeState = {
  ended: boolean;
  style: CellStyle;
};

type LifeActions = {
  step: () => void;
};
export const useGameOfLife = create<ConwayLifeState & LifeActions>(
  (set, get) => ({
    ended: Constants.conwayLifeState.ended,
    style: Constants.conwayLifeState.style,
    step: () => {
      const initialGrid = useGrid.getState().gridCell;
      const size = useAppState.getState().grid.cellSize;
      const gridSize = useAppState.getState().grid.gridSize;
      const alive = initialGrid.filter(
        (e) => !e.attribute?.startsWith("inactive")
      );
      if (alive?.length === 0) {
        set({ ended: true });
        return;
      }
      const aliveSet = new Set(alive.map((p) => `${p.x},${p.y}`));
      const neighborCount = new Map<string, number>();

      for (const cell of alive) {
        for (const n of NEIGHBORS) {
          const nx = cell.x + n.x * size.x;
          const ny = cell.y + n.y * size.y;

          const key = `${nx},${ny}`;
          neighborCount.set(key, (neighborCount.get(key) ?? 0) + 1);
        }
      }
      const nextAlive: Cell[] = [];
      for (const [key, count] of neighborCount.entries()) {
        const [x, y] = key.split(",").map(Number);
        const isAlive = aliveSet.has(key);
        if (
          (isAlive && (count === 2 || count === 3)) ||
          (!isAlive && count === 3)
        ) {
          const raw = { x, y };
          const parsed = CellGenerator.nearestGridPoint({
            startPoint: { x: 0, y: 0 },
            cellSize: size,
            endPoint: gridSize,
            rawPoint: raw,
          });
          if (!parsed) continue;
          nextAlive.push({
            ...parsed,
            attribute: "life",
            style: get().style,
          });
        }
      }
      useGrid.getState().replaceGrid([...nextAlive]);
    },
  })
);
