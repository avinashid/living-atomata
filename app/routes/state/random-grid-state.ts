import { create } from "zustand";
import type { Cell, CellStyle } from "~/utils/types";
import { useGrid } from "./grid-state";
import { Constants } from "~/utils/constants";

const randomAttributeKey = "random-key";

export type RandomState = {
  state: "idle" | "generating";
  total: number;
  style: CellStyle;
  delay?: number;
  count: number;
};

type Actions = {
  updateState: (state: Partial<Omit<RandomState, "total">>) => void;
  appendRandom: (qty: Cell) => void;
  appendManyRandom: (qty: Cell[]) => void;
  setRandom: (qty: Cell[]) => void;
  resetRandom: () => void;
};

export const useRandomGridState = create<RandomState & Actions>((set, get) => ({
  state: Constants.random.state,
  style: Constants.random.style,
  total: Constants.random.total,
  count: Constants.random.count,
  updateState: (state) =>
    set({
      state: state.state ?? get().state,
      style: state.style ?? get().style,
      count: state.count ?? get().count,
    }),
  appendRandom: (cell) => {
    const withAttr: Cell = {
      ...cell,
      attribute: randomAttributeKey,
      style: get().style,
    };
    useGrid.getState().appendGridCell(withAttr);
    set((s) => ({ total: s.total + 1 }));
  },
  appendManyRandom: (cells) => {
    const withAttr = cells.map<Cell>((c) => ({
      ...c,
      attribute: randomAttributeKey,
      style: get().style,
    }));
    useGrid.getState().appendManyGridCells(withAttr);
    set((s) => ({ total: s.total + withAttr.length }));
  },
  setRandom: (cells) => {
    const grid = useGrid.getState();
    grid.removeGridByAttribute(randomAttributeKey);
    const withAttr = cells.map<Cell>((c) => ({
      ...c,
      attribute: randomAttributeKey,
      style: get().style,
    }));
    grid.appendManyGridCells(withAttr);
    set({ total: withAttr.length });
  },
  resetRandom: () => {
    useGrid.getState().removeGridByAttribute(randomAttributeKey);
    set({ total: 0, state: "idle" });
  },
}));
