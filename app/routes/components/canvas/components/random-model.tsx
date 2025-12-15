import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { FormNumberField, FormWrapper } from "~/components/custom/form-wrapper";
import PageSection from "~/components/custom/page-section";
import { SimpleModel } from "~/components/custom/simple-model";
import { Button } from "~/components/ui/button";
import { useTimer } from "~/hooks/useTimer";
import { useAppState } from "~/routes/state/app-state";
import { useRandomGridState } from "~/routes/state/random-grid-state";
import { CellGenerator } from "~/utils/cell-generator";
import { zodResolver } from "@hookform/resolvers/zod";

const RandomModel = () => {
  const schema = z.object({
    count: z.number().min(1, { message: "Input must be greater than 0" }),
    delay: z.number().min(0).optional(),
  });

  const grid = useAppState().grid;
  const state = useRandomGridState((s) => s.state);
  const updateState = useRandomGridState((s) => s.updateState);
  const randomDelay = useRandomGridState((s) => s.delay);
  const remainingCount = useRandomGridState((s) => s.count);
  const addRandom = useRandomGridState((s) => s.appendRandom);
  const addManyRandom = useRandomGridState((s) => s.appendManyRandom);
  const remainingCountRef = useRef<number>(remainingCount);
  useEffect(() => {
    remainingCountRef.current = remainingCount;
  }, [remainingCount]);
  const zForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { count: 1, delay: 0 },
  });
  const { start, reset, stop } = useTimer({
    interval: `${randomDelay ?? 0}:ms`,
    autoStart: remainingCount > 0,
    onTick: () => {
      const currentRemaining = remainingCountRef.current ?? 0;
      if (currentRemaining <= 0) {
        updateState({ count: 0, state: "idle" });
        stop();
        return;
      }

      const rawRandom = CellGenerator.randomPointBetween(
        { x: 0, y: 0 },
        grid.gridSize
      );
      const point = CellGenerator.nearestGridPoint({
        rawPoint: rawRandom,
        startPoint: { x: 0, y: 0 },
        endPoint: grid.gridSize,
        cellSize: grid.cellSize,
      });
      if (!point) {
        updateState({ count: Math.max(0, currentRemaining - 1) });
        if (remainingCountRef.current - 1 <= 0) {
          stop();
          updateState({ state: "idle" });
        }
        return;
      }

      addRandom({ ...point, attribute: "random-box" });

      const next = Math.max(0, currentRemaining - 1);
      updateState({ count: next });

      if (currentRemaining - 1 <= 0) {
        stop();
        updateState({ state: "idle", count: 0 });
      }
    },
  });

  const onSubmit = (e: z.infer<typeof schema>) => {
    if ((e?.delay || 0) <= 0) {
      const points = CellGenerator.nNearestGridRandomPoints({
        start: { x: 0, y: 0 },
        end: grid.gridSize,
        n: e.count,
        size: grid.cellSize,
      });
      addManyRandom(points);
      return;
    }

    updateState({
      count: e.count,
      delay: e.delay,
      state: "generating",
    });

    reset();
    remainingCountRef.current = e.count;
    start();
  };

  return (
    <SimpleModel
      className="p-0 min-h-80"
      trigger={
        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-semibold flex items-center gap-1 hover:bg-muted/80 cursor-pointer">
          Randomizer
        </div>
      }
    >
      <PageSection
        title="Randomizer"
        description="Create randomizer by adding count and delay.."
      >
        <FormWrapper formData={zForm} onSubmit={onSubmit}>
          <FormNumberField
            control={zForm.control}
            label="Random total"
            type="number"
            name="count"
          />
          <FormNumberField
            control={zForm.control}
            label="Delay (ms)"
            type="number"
            name="delay"
          />
          <Button
            disabled={state === "generating"}
            size={"sm"}
            type="submit"
            className="w-fit"
          >
            {state === "generating" ? "Generating" : "Randomize"}
          </Button>
        </FormWrapper>
      </PageSection>
    </SimpleModel>
  );
};

export default RandomModel;
