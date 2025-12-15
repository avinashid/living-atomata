// import React, { useEffect } from "react";
// import { useTimer } from "~/hooks/useTimer";
// import { CellGenerator } from "~/utils/cell-generator";
// import { useGrid } from "../state/grid-state";
// import { ConstantTYpe } from "~/utils/constants";
// import type { Cell } from "~/utils/types";

// const useRandomGridLayout = (props?: { onRandom?: (point: Cell) => void }) => {
//   const { start, end, size } = useGrid();
//   const addRandom = useGrid((s) => s.appendGrid);
//   return useTimer({
//     interval: ConstantTYpe.randomGenerateSecond,
//     endAt: ConstantTYpe.randomCount,
//     onTick: (tick) => {
//       if (tick >= ConstantTYpe.randomCount) {
//         return;
//       }
//       const rawRandom = CellGenerator.randomPointBetween(start, end);
//       const point = CellGenerator.nearestGridPoint(rawRandom, start, end, size);
//       if (!point) return;
//       addRandom({ ...point, attribute: "random-box", color: "green" });
//       props?.onRandom?.(point);
//     },
//     onEnd: () => {
//       console.log(`Random generator ended`);
//     },
//   });
// };

// export default useRandomGridLayout;
