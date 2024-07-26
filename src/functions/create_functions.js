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
  const hourly = forms
    .map((f) => {
      return {
        id: Date.now(),
        Hstr: f.Hstr,
        Mstr: f.Mstr,
        Hstp: f.Hstp,
        Mstp: f.Mstp,
      };
    })
    .sort((a, b) => {
      const A = parseInt(a.Hstr, 10);
      const B = parseInt(b.Hstr, 10);
      return A - B;
    });

  const durations = forms.map((f) => {
    return f.duration;
  });

  const dtt = addTime(durations);

  const ca = calcCA(dtt, data.client.th);
  const bnf = calcBNF(ca, data.client.chrg);

  try {
    for (let date of dates) {
      let line;
      let join = false;
      const exLine = store.state.lines.find(
        (l) =>
          new Date(l.date).setHours(0, 0, 0, 0) ===
          new Date(date).setHours(0, 0, 0, 0)
      );

      if (exLine && mode === 1) {
        const newHourly = exLine.hourly
          .map((h) => {
            return {
              id: Date.now(),
              Hstr: h.Hstr,
              Mstr: h.Mstr,
              Hstp: h.Hstp,
              Mstp: h.Mstp,
            };
          })
          .concat(hourly)
          .sort((a, b) => {
            const A = parseInt(a.Hstr, 10);
            const B = parseInt(b.Hstr, 10);
            return A - B;
          });

        line = {
          id: Date.now(),
          date: date,
          hourly: newHourly,
          dtt: addTime([exLine.dtt, dtt]),
          note: exLine.note ? `${exLine.note} / ${data.note}` : data.note,
          client: {
            id: data.client.id,
            name: data.client.name,
            color: data.client.color,
            th: data.client.th,
            chrg: data.client.chrg,
            ca: exLine.client.ca + ca,
            bnf: exLine.client.bnf + bnf,
            billed: false,
            paid: false,
            dop: null,
          },
        };
        join = true;
      } else {
        line = {
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
      }

      try {
        await addLine(store, line, 1);
      } catch (error) {
        console.log(error);
        throw error;
      }

      if (join) {
        try {
          await removeLine(store, exLine);
        } catch (error) {
          console.log(error);
          throw error;
        }
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
