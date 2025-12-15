// import { useTimer } from "~/hooks/useTimer";
// import { ConstantTYpe } from "~/utils/constants";
// import { useGameOfLife } from "../state/game-of-life";
// import { useEffect, useState } from "react";

// const useGameOfLifeLayout = (props: { start: boolean }) => {
//   const step = useGameOfLife((s) => s.step);
//   const { start } = useTimer({
//     interval: ConstantTYpe.lifeTickMs,
//     onEnd: (e) => {
//       console.log("ended", e);
//     },
//     autoStart: false,
//     onTick: () => {
//       step();
//     },
//   });
//   useEffect(() => {
//     if (props.start) {
//       start();
//     }
//   }, [props.start]);
// };

// export default useGameOfLifeLayout;
