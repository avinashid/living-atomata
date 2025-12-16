import React from "react";
import CanvasLayout from "../components/canvas/canvas-layout";
import { Badge } from "~/components/ui/badge";
import { useTimer } from "~/hooks/useTimer";
import { useGameOfLife } from "../state/game/game-of-life-state";

const page = () => {
  const step = useGameOfLife((e) => e.step);
  const { start, stop, running } = useTimer({
    interval: `50:ms`,
    autoStart: false,
    onTick: () => {
      step();
    },
  });
  return (
    <div className="min-h-screen grid place-content-center gap-2">
      <CanvasLayout
        title={
          <Badge className="my-2 font-semibold">Conway's game of life</Badge>
        }
      >
        <div className="my-2">
          <div
            onClick={() => {
              if (!running) start();
              else stop();
            }}
            className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-semibold flex items-center gap-1 hover:bg-muted/80 cursor-pointer w-fit"
          >
            {running ? "Stop" : "Start"}
          </div>
        </div>
      </CanvasLayout>
    </div>
  );
};

export default page;
