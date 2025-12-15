import { useEffect, useRef } from "react";
import type { Cell } from "~/utils/types";
import { useAppState } from "../../../state/app-state";
import { useMouseState } from "../../../state/mouse-state";

type CanvasGridProps = {
  points: Cell[];
  start?: Cell;
  end?: Cell;
  className?: string;
  fill?: string;
  strokeColor?: string;
};

export function CanvasGrid({
  points,
  start: initialStart,
  end: initialEnd,
  className,
  fill,
  strokeColor,
}: CanvasGridProps) {
  const mouseClick = useMouseState((e) => e.onMouseClick);
  const mouseHover = useMouseState((e) => e.updateMouseLocation);
  const size = useAppState((e) => e.grid.cellSize);
  const gridSize = useAppState((e) => e.grid.gridSize);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridStart = { x: 0, y: 0 };
  const gridEnd = useAppState((s) => s.grid.gridSize);
  const start = initialStart ?? gridStart;
  const end = initialEnd ?? gridEnd;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
    ctx.clip();
    for (const p of points) {
      ctx.strokeStyle = p.style?.strokeColor ?? strokeColor ?? "#000";
      ctx.lineWidth = p.style?.stroke || 1;
      ctx.fillStyle = p.style?.color ?? fill ?? "#1B211A";
      ctx.fillRect(p.x, p.y, size.x, size.y);
      ctx.strokeRect(
        p.x + ctx.lineWidth / 2,
        p.y + ctx.lineWidth / 2,
        size.x - ctx.lineWidth,
        size.y - ctx.lineWidth
      );
    }
    ctx.restore();
  }, [points, size, start, end, fill, strokeColor]);

  return (
    <canvas
      onClick={mouseClick}
      ref={canvasRef}
      width={gridSize.x}
      height={gridSize.y}
      onMouseMove={(e) => {
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const location = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        mouseHover(location);
      }}
      className={className}
    />
  );
}
