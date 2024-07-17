// Import
import { addLine, removeLine } from "@/functions/bdd_lines_functions.js";
import { addTime } from "@/functions/time_functions.js";
import { calcCA, calcBNF } from "@/functions/money_functions";

// Create lexport async function createLines(

export async function createLines(
  store,
  forms,
  dates,
  data,
  mode,
  presentLine
) {
  const hourly = forms.map((f) => {
    return {
      id: Date.now(),
      Hstr: f.Hstr,
      Mstr: f.Mstr,
      Hstp: f.Hstp,
      Mstp: f.Mstp,
    };
  });

  const durations = forms.map((f) => {
    return f.duration;
  });

  const dtt = addTime(durations);

  const ca = calcCA(dtt, data.client.th);
  const bnf = calcBNF(ca, data.client.chrg);

  try {
    for (let date of dates) {
      const line = {
        id: Date.now(),
        date: date,
        hourly: hourly,
        dtt: dtt,
        note: data.note,
        client: {
          id: data.client.id,
          name: data.client.name,
          color: data.client.color,
          th: data.client.th,
          chrg: data.client.chrg,
          ca: ca,
          bnf: bnf,
          billed: data.client.billed,
          paid: data.client.paid,
          dop: data.client.dop,
        },
      };
      try {
        await addLine(store, line, 1);
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    if (mode === 2) {
      try {
        await removeLine(store, presentLine);
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
