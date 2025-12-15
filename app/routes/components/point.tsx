import React from "react";
import type { Cell } from "~/utils/types";

const PointBox = ({
  location,
  size,
  className,
}: {
  location: Cell;
  size: Cell;
  className?: string;
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: location.y,
        left: location.x,
        width: size.x,
        height: size.y,
      }}
      className={"border border-gray-900 " + className}
    />
  );
};

export default PointBox;
