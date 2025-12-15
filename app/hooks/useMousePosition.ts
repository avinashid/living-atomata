import React, { useEffect } from "react";
import type { Cell } from "~/utils/types";

export function useMousePosition(): Cell | undefined {
  const [position, setPosition] = React.useState<Cell>();

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return position;
}
