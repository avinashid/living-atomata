import { create } from "zustand";
import type { Cell } from "~/utils/types";
import { useGrid } from "../grid-state";
import { useAppState } from "../app-state";

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
type LifeActions = {
  step: () => void;
  ended: boolean;
};
export const useGameOfLife = create<LifeActions>((set, get) => ({
  ended: false,
  running: false,
  lastHash: null,
  step: () => {
    const initialGrid = useGrid.getState().gridCell;
    const size = useAppState().grid.gridSize;
    const alive = initialGrid.filter(
      (e) => !e.attribute?.startsWith("inactive")
    );
    if (alive.length === 0) {
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
        nextAlive.push({
          x,
          y,
          attribute: "life",
          style: {
            color: "blue",
          },
        });
      }
    }

    const inactive = initialGrid.filter((e) =>
      e.attribute?.startsWith("inactive")
    );
    useGrid.getState().replaceGrid([...inactive, ...nextAlive]);
  },
}));
