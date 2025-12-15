import { create } from "zustand";
import type { Cell, CellStyle, Point } from "~/utils/types";
import type { ColorSchema } from "~/utils/colors";
import { Constants } from "~/utils/constants";
import { CellGenerator } from "~/utils/cell-generator";

export type AppInitialState = {
  colorSchema: ColorSchema;
  grid: {
    gridSize: Point;
    cellSize: Point;
    style: CellStyle;
  };
  initialGrid: {
    cell: Cell[];
  };
};

type Actions = {
  updateGrid: (props: Partial<AppInitialState["grid"]>) => void;
  updateColorSchema: (props: ColorSchema) => void;
};

export const useAppState = create<AppInitialState & Actions>((set, get) => ({
  colorSchema: Constants.app.colorSchema,
  grid: Constants.app.grid,
  initialGrid: {
    cell: CellGenerator.generateGrids({
      start: { x: 0, y: 0 },
      end: Constants.app.grid.gridSize,
      cellSize: Constants.app.grid.cellSize,
    }).map((e) => ({
      ...e,
      attribute: "inactive-initial",
      style: Constants.app.grid.style,
    })),
  },
  updateColorSchema: (colorSchema) => set({ colorSchema }),
  updateGrid: (props) => {
    const newInitialCell = CellGenerator.generateGrids({
      start: { x: 0, y: 0 },
      end: {
        x: props.gridSize?.x ?? get().grid.gridSize.x,
        y: props.gridSize?.y ?? get().grid.gridSize.y,
      },
      cellSize: props.cellSize ?? get().grid.cellSize,
    }).map((e) => ({
      ...e,
      attribute: "inactive-initial",
      style: get().grid.style,
    }));
    set({
      grid: { ...get().grid, ...props },
      initialGrid: {
        cell: newInitialCell,
      },
    });
  },
}));
