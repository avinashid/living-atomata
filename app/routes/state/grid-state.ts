import { create } from "zustand";
import type { Cell, Point } from "~/utils/types";

type State = {
  gridCell: Cell[];
};

type Actions = {
  appendGridCell: (qty: Cell) => void;
  removeGridByAttribute: (attr: string) => void;
  appendManyGridCells: (qty: Cell[]) => void;
  replaceGrid: (qty: Cell[], opts?: { activeOnly?: boolean }) => void;
  getCell: (qty: Point, opts?: { activeOnly?: boolean }) => Cell[] | undefined;
  getCellsByAttribute: (attr: string) => Cell[] | undefined;
  removeCell: (qty: Point, opts: { activeOnly?: boolean }) => void;
};

export const useGrid = create<State & Actions>((set, get) => ({
  gridCell: [],
  appendGridCell: (qty) => {
    set((state) => ({
      gridCell: [...state.gridCell, qty],
    }));
  },
  getCell: (point, opts) =>
    get().gridCell.filter(
      (e) =>
        e.x === point.x &&
        e.y === point.y &&
        (opts?.activeOnly ? !e.attribute?.startsWith("inactive") : true)
    ),
  getCellsByAttribute: (attr) =>
    get().gridCell.filter((e) => e.attribute === attr),
  removeCell: (point, opts) => {
    set((state) => ({
      gridCell: state.gridCell.filter((e) => {
        const isTarget = e.x === point.x && e.y === point.y;
        if (!isTarget) return true;

        if (opts?.activeOnly) {
          return e.attribute?.startsWith("inactive");
        }

        return false;
      }),
    }));
  },
  removeGridByAttribute: (attr) => {
    set((state) => ({
      gridCell: state.gridCell.filter((g) => g.attribute !== attr),
    }));
  },
  appendManyGridCells: (qty) =>
    set((state) => ({ gridCell: [...state.gridCell, ...qty] })),
  replaceGrid: (qty, opts) =>
    set({
      gridCell: opts?.activeOnly
        ? {
            ...get().gridCell.filter(
              (g) => !g.attribute?.startsWith("inactive")
            ),
            ...qty,
          }
        : qty,
    }),
}));
