import { create } from "zustand";
import { Constants } from "~/utils/constants";
import type { CellStyle, Point } from "~/utils/types";
import { useGrid } from "./grid-state";
import { CellGenerator } from "~/utils/cell-generator";
import { useAppState } from "./app-state";

export type MouseState = {
  clickActive: boolean;
  clickStyle: CellStyle;
  hoverActive: boolean;
  style: CellStyle;
};

type Actions = {
  updateStyle: (qty: CellStyle) => void;
  getMouseLocation: () => Point | undefined;
  updateMouseState: (opts: Partial<MouseState>) => void;
  updateMouseLocation: (qty: Point) => void;
  onMouseClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
};

export const useMouseState = create<MouseState & Actions>((set, get) => ({
  style: Constants.mouse.style,
  clickStyle: Constants.mouse.clickStyle,
  clickActive: Constants.mouse.clickActive,
  hoverActive: Constants.mouse.hoverActive,
  updateMouseLocation: (qty) => {
    if (get().hoverActive === false) return;
    const gridState = useGrid.getState();
    const appGrid = useAppState.getState().grid;
    const current = gridState.getCellsByAttribute("inactive-mouse-hover")?.[0];
    const next = CellGenerator.gridCellFromPointer({
      startPoint: { x: 0, y: 0 },
      endPoint: {
        x: appGrid.gridSize.x,
        y: appGrid.gridSize.y,
      },
      cellSize: appGrid.cellSize,
      rawPoint: qty,
    });
    if (!next) {
      if (current) {
        gridState.removeGridByAttribute("inactive-mouse-hover");
      }
      return;
    }
    if (current && current.x === next.x && current.y === next.y) {
      return;
    }
    gridState.removeGridByAttribute("inactive-mouse-hover");
    gridState.appendGridCell({
      ...next,
      attribute: "inactive-mouse-hover",
      style: get().style,
    });
  },
  onMouseClick: (e) => {
    if (get().clickActive === false) return;
    const grid = useAppState.getState().grid;
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const currentLocation = { x, y };
    const locationOnGrid = CellGenerator.gridCellFromPointer({
      cellSize: grid.cellSize,
      startPoint: { x: 0, y: 0 },
      endPoint: grid.gridSize,
      rawPoint: currentLocation,
    });
    if (!locationOnGrid) return;
    const alreadyPresent = useGrid
      .getState()
      .getCell(locationOnGrid, { activeOnly: true });
    if (alreadyPresent?.length) {
      useGrid.getState().removeCell(locationOnGrid, {
        activeOnly: true,
      });
      return;
    }
    useGrid.getState().appendGridCell({
      ...locationOnGrid,
      style: get().clickStyle,
      attribute: "mouse-clicked",
    });
  },
  updateMouseState: (e) => {
    set({
      clickActive: e.clickActive ?? get().clickActive,
      hoverActive: e.hoverActive ?? get().hoverActive,
      style: e.style ?? get().style,
      clickStyle: e.clickStyle ?? get().clickStyle,
    });
  },
  updateStyle: (qty) => set({ style: qty }),
  getMouseLocation: () =>
    useGrid
      .getState()
      .gridCell.find((e) => e.attribute === "inactive-mouse-hover"),
}));
