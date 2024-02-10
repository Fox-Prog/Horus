import { minsToHours } from "./time_functions";

export function averageDays(durations, tth) {
  const sum_mins =
    parseInt(tth.split("h")[0] * 60) + parseInt(tth.split("h")[1]);

  const average_mins = Math.floor(sum_mins / durations.length);

  return minsToHours(average_mins).replace(":", "h");
}
