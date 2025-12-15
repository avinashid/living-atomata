import type { Cell, Point, Spin } from "./types";

export class CellGenerator {
  private static ensurePositiveSize(size: Cell) {
    if (size.x <= 0 || size.y <= 0) {
      throw new RangeError("cellSize must be greater than 0");
    }
  }

  private static normalizedBounds(a: Point, b: Point) {
    return {
      minX: Math.min(a.x, b.x),
      maxX: Math.max(a.x, b.x),
      minY: Math.min(a.y, b.y),
      maxY: Math.max(a.y, b.y),
    };
  }

  // Optional higher-quality RNG (uses crypto when available)
  static defaultRng(): () => number {
    if (
      typeof globalThis === "object" &&
      "crypto" in globalThis &&
      typeof (globalThis as any).crypto.getRandomValues === "function"
    ) {
      return () => {
        const arr = new Uint32Array(1);
        (globalThis as any).crypto.getRandomValues(arr);
        return arr[0] / 0x1_0000_0000; // / 2^32
      };
    }
    return Math.random;
  }

  // Generates top-left anchors for cells that fully fit inside bounding box.
  static generateGrids({
    start,
    end,
    cellSize,
  }: {
    start: Point;
    end: Point;
    cellSize: Cell;
  }): Cell[] {
    this.ensurePositiveSize(cellSize);
    const { minX, maxX, minY, maxY } = this.normalizedBounds(start, end);

    const countX = Math.floor((maxX - minX) / cellSize.x);
    const countY = Math.floor((maxY - minY) / cellSize.y);

    if (countX <= 0 || countY <= 0) return [];

    const out: Cell[] = new Array(countX * countY);
    let idx = 0;
    for (let ix = 0; ix < countX; ix++) {
      const x = minX + ix * cellSize.x;
      for (let iy = 0; iy < countY; iy++) {
        const y = minY + iy * cellSize.y;
        out[idx++] = { x, y };
      }
    }
    return out;
  }

  // Random integer inclusive
  static randIntInclusive(
    min: number,
    max: number,
    rng: () => number = CellGenerator.defaultRng()
  ): number {
    if (min > max) [min, max] = [max, min];
    const range = max - min + 1;
    return Math.floor(rng() * range) + min;
  }

  static randomPointBetween(
    a: Cell,
    b: Cell,
    rng: () => number = CellGenerator.defaultRng()
  ): Cell {
    const minX = Math.min(a.x, b.x);
    const maxX = Math.max(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxY = Math.max(a.y, b.y);
    return {
      x: this.randIntInclusive(minX, maxX, rng),
      y: this.randIntInclusive(minY, maxY, rng),
    };
  }

  /** Hover-safe: Which cell contains this point?
   *  - Behavior: clamp rawPoint into usable area, then floor to cell anchor.
   *  - Returns undefined if no full cell fits inside bounding box.
   */
  static gridCellFromPointer(props: {
    rawPoint: Cell | undefined;
    startPoint: Cell;
    endPoint: Cell;
    cellSize: Cell;
  }): Cell | undefined {
    const { rawPoint, startPoint, endPoint, cellSize } = props;
    if (!rawPoint) return undefined;
    this.ensurePositiveSize(cellSize);

    const minX = Math.min(startPoint.x, endPoint.x);
    const minY = Math.min(startPoint.y, endPoint.y);
    const maxX = Math.max(startPoint.x, endPoint.x) - cellSize.x;
    const maxY = Math.max(startPoint.y, endPoint.y) - cellSize.y;
    const padX = cellSize.x;
    const padY = cellSize.y;

    if (
      rawPoint.x < minX - padX ||
      rawPoint.x > maxX + padX ||
      rawPoint.y < minY - padY ||
      rawPoint.y > maxY + padY
    ) {
      return undefined;
    }
    if (maxX < minX || maxY < minY) return undefined;

    // Clamp first so pointer outside bounds snaps to edge cell instead of undefined.
    const clampedX = Math.min(Math.max(rawPoint.x, minX), maxX);
    const clampedY = Math.min(Math.max(rawPoint.y, minY), maxY);

    const snappedX =
      Math.floor((clampedX - minX) / cellSize.x) * cellSize.x + minX;
    const snappedY =
      Math.floor((clampedY - minY) / cellSize.y) * cellSize.y + minY;

    return { x: snappedX, y: snappedY };
  }

  // Old nearest/round-based snapping kept for clicks if you want it.
  static nearestGridPoint(props: {
    rawPoint: Cell | undefined;
    startPoint: Cell;
    endPoint: Cell;
    cellSize: Cell;
    mode?: "nearest" | "floor" | "ceil";
  }): Cell | undefined {
    const {
      rawPoint,
      startPoint,
      endPoint,
      cellSize,
      mode = "nearest",
    } = props;
    if (!rawPoint) return undefined;
    this.ensurePositiveSize(cellSize);

    const { minX, maxX, minY, maxY } = this.normalizedBounds(
      startPoint,
      endPoint
    );
    const usableMaxX = maxX - cellSize.x;
    const usableMaxY = maxY - cellSize.y;
    if (usableMaxX < minX || usableMaxY < minY) return undefined;

    const relativeX = (rawPoint.x - minX) / cellSize.x;
    const relativeY = (rawPoint.y - minY) / cellSize.y;

    const snappedRelativeX =
      mode === "floor"
        ? Math.floor(relativeX)
        : mode === "ceil"
        ? Math.ceil(relativeX)
        : Math.round(relativeX);
    const snappedRelativeY =
      mode === "floor"
        ? Math.floor(relativeY)
        : mode === "ceil"
        ? Math.ceil(relativeY)
        : Math.round(relativeY);

    const snappedX = snappedRelativeX * cellSize.x + minX;
    const snappedY = snappedRelativeY * cellSize.y + minY;

    if (
      snappedX < minX ||
      snappedX > usableMaxX ||
      snappedY < minY ||
      snappedY > usableMaxY
    ) {
      return undefined;
    }
    return { x: snappedX, y: snappedY };
  }

  static nNearestGridRandomPoints({
    start,
    end,
    size,
    n,
    allowDuplicates = true,
    mode = "nearest",
    rng = CellGenerator.defaultRng(),
  }: {
    start: Cell;
    end: Cell;
    size: Cell;
    n: number;
    allowDuplicates?: boolean;
    mode?: "nearest" | "floor" | "ceil";
    rng?: () => number;
  }): Cell[] {
    if (n <= 0) return [];
    this.ensurePositiveSize(size);

    const { minX, maxX, minY, maxY } = this.normalizedBounds(start, end);
    const countX = Math.floor((maxX - minX) / size.x);
    const countY = Math.floor((maxY - minY) / size.y);
    const total = countX * countY;
    if (total <= 0) return [];

    if (allowDuplicates) {
      const out: Cell[] = new Array(n);
      for (let i = 0; i < n; i++) {
        const ix = this.randIntInclusive(0, countX - 1, rng);
        const iy = this.randIntInclusive(0, countY - 1, rng);
        out[i] = { x: minX + ix * size.x, y: minY + iy * size.y };
      }
      return out;
    }

    if (n > total) {
      throw new RangeError(
        `Requested ${n} unique points but only ${total} cells available`
      );
    }

    const anchors = this.generateGrids({ start, end, cellSize: size });
    for (let i = 0; i < n; i++) {
      const j = i + Math.floor(rng() * (total - i));
      const tmp = anchors[i];
      anchors[i] = anchors[j];
      anchors[j] = tmp;
    }
    return anchors.slice(0, n);
  }

  static getRandomSpin(rng: () => number = CellGenerator.defaultRng()): Spin {
    const spins: Spin[] = ["up", "down", "left", "right"];
    return spins[Math.floor(rng() * spins.length)];
  }
}
