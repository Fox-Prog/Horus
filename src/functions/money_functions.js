import { hoursToHdec } from "./time_functions";

export function calcProfit(dtt, client) {
  const hdec = hoursToHdec(dtt);
  const ca = parseFloat(client.th) * hdec;
  return ca.toFixed(2).replace(".", ",");
}
