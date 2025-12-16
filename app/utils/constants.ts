import type { AppInitialState } from "~/routes/state/app-state";
import { Colors } from "./colors";
import type { MouseState } from "~/routes/state/mouse-state";
import type { RandomState } from "~/routes/state/random-grid-state";
import type { ConwayLifeState } from "~/routes/state/game/game-of-life-state";

type ConstantType = {
  app: AppInitialState;
  mouse: MouseState;
  random: RandomState;
  conwayLifeState: ConwayLifeState;
};

export const Constants = {
  app: {
    colorSchema: "dark",
    grid: {
      cellSize: { x: 6, y: 6 },
      gridSize: { x: window.innerWidth - 200, y: window.innerHeight - 200 },
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
  conwayLifeState: {
    ended: false,
    style: {
      color: "pink",
      stroke: 1,
      strokeColor: Colors["dark"].primary,
    },
  },
} satisfies ConstantType;
