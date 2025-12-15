import { create } from "zustand";
import { CellGenerator } from "~/utils/cell-generator";
import type { Cell, Spin } from "~/utils/types";
import { useGrid } from "./grid-state";
import { MOVE_BY_SPIN } from "~/utils/func";
import { v4 as uuid } from "uuid";
import { useAppState } from "./app-state";

type State = {
  currentTail: {
    tailKey: string;
    spin: Spin;
    initialTail: Cell;
    currentTail: Cell;
    ended: boolean;
  }[];
};

type Actions = {
  addTail: (qty: Cell) => void;
  addToTail: (qty: Cell) => void;
  addToTailBatch: () => void;
  getTail: (
    qty: Cell
  ) =>
    | { ended: boolean; initialTail: Cell; currentTail: Cell; spin: Spin }
    | undefined;
};

export const useRandomGridTail = create<State & Actions>((set, get) => ({
  tailRandom: [],
  currentTail: [],
  addTail: (qty) => {
    if (
      get().currentTail.some(
        (t) => t.currentTail.x === qty.x && t.currentTail.y === qty.y
      )
    )
      return;
    set({
      currentTail: [
        ...get().currentTail,
        {
          initialTail: qty,
          currentTail: qty,
          ended: false,
          tailKey: uuid(),
          spin: CellGenerator.getRandomSpin(),
        },
      ],
    });
  },
  getTail: (qty) => {
    const index = get().currentTail.findIndex(
      (t) => t.currentTail.x === qty.x && t.currentTail.y === qty.y
    );
    return get().currentTail[index];
  },
  addToTail: (qty) => {
    const grid = useAppState.getState().grid;
    const start = { x: 0, y: 0 };
    const end = grid.gridSize;
    const size = grid.cellSize;

    const state = get();

    const index = state.currentTail.findIndex(
      (t) => t.currentTail.x === qty.x && t.currentTail.y === qty.y
    );
    if (index === -1) return;

    const tail = state.currentTail[index];
    if (tail.ended) return;

    const move = MOVE_BY_SPIN[tail.spin];

    const next: Cell = {
      x: tail.currentTail.x + move.x * size.x,
      y: tail.currentTail.y + move.y * size.y,
    };

    const withinWindow = CellGenerator.nearestGridPoint({
      rawPoint: next,
      startPoint: start,
      endPoint: end,
      cellSize: size,
    });
    const isCollidedWithOtherTails = useGrid
      .getState()
      .gridCell.filter(
        (e) => e.attribute === "random-box" || e.attribute?.startsWith("tail")
      )
      .some((p) => p.x === withinWindow?.x && p.y === withinWindow?.y);

    if (!withinWindow || isCollidedWithOtherTails) {
      const updated = [...state.currentTail];
      updated[index] = {
        ...tail,
        ended: true,
      };

      set({ currentTail: updated });
      return;
    }

    const updatedTails = [...state.currentTail];
    updatedTails[index] = {
      ...tail,
      currentTail: withinWindow,
    };
    useGrid.getState().appendGridCell({
      ...withinWindow,
      attribute: `tail-${tail.tailKey}`,
      style: { color: "blue" },
    });
    set({
      currentTail: updatedTails,
    });
  },
  addToTailBatch: () => {
    const listPending = get().currentTail.filter((e) => !e.ended);
    listPending.forEach((e) => get().addToTail(e.currentTail));
  },
}));
