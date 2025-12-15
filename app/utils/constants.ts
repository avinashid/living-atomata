import type { AppInitialState } from "~/routes/state/app-state";
import { Colors } from "./colors";
import type { MouseState } from "~/routes/state/mouse-state";
import type { RandomState } from "~/routes/state/random-grid-state";

type ConstantType = {
  app: AppInitialState;
  mouse: MouseState;
  random: RandomState;
};

export const Constants = {
  app: {
    colorSchema: "dark",
    grid: {
      cellSize: { x: 10, y: 10 },
      gridSize: { x: 15 * 80, y: 10 * 40 },
      style: {
        color: Colors["dark"].input,
        stroke: 3,
        strokeColor: Colors["dark"].muted,
      },
    },
    initialGrid: {
      cell: [],
    },
  },
  mouse: {
    clickActive: true,
    hoverActive: false,
    clickStyle: {
      color: "green",
      stroke: 1,
      strokeColor: Colors["dark"].primary,
    },
    style: {
      color: "red",
      stroke: 1,
      strokeColor: Colors["dark"].primary,
    },
  },
  random: {
    state: "idle",
    count: 0,
    delay: 2,
    style: {
      color: "yellow",
      stroke: 1,
      strokeColor: Colors["dark"].primary,
    },
    total: 0,
  },
} satisfies ConstantType;
