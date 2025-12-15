type TimeUnit = "ms" | "sec" | "min" | "hour" | "fps";
export type TimeString = `${number}:${TimeUnit}`;

export class TimeUtils {
  static getTime(input?: TimeString): number | undefined {
    if (!input) return undefined;
    const [numStr, unit] = input?.split(":") as [string, TimeUnit];
    const value = Number(numStr);

    switch (unit) {
      case "ms":
        return value;

      case "sec":
        return value * 1000;

      case "min":
        return value * 1000 * 60;

      case "hour":
        return value * 1000 * 60 * 60;
      case "fps":
        return 1000 / value;

      default: {
        return undefined;
      }
    }
  }
}
