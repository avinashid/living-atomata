// import { useEffect } from "react";
// import { useRandomGridTail } from "../state/tail-grid-state";
// import { useTimer } from "~/hooks/useTimer";
// import { Constants } from "~/utils/constants";

// const useRandomGridTailLayout = (props: { start: boolean }) => {
//   const currentTail = useRandomGridTail((e) => e.currentTail);
//   const addToTail = useRandomGridTail((e) => e.addToTailBatch);

//   const { start, stop } = useTimer({
//     autoStart: false,
//     interval: Constants.tailGenerateSecond,
//     onTick: () => {
//       addToTail();
//       if (currentTail.find((e) => !e.ended)) stop();
//     },
//   });
//   useEffect(() => {
//     if (props.start) {
//       start();
//     }
//   }, [props.start]);
// };

// export default useRandomGridTailLayout;
