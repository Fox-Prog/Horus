import { addLine, removeLine } from "@/functions/bdd_lines_functions.js";
import { calcCA, calcBNF } from "@/functions/money_functions";

export async function removeLinesOfClient(store, client) {
  // Need ID of client
  const lines = store.state.lines.filter((l) => l.client.id === client);
  if (lines.length > 0) {
    for (const l of lines) {
      try {
        await removeLine(store, l);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

export async function setClientToHourly(store, newClient, oldClient) {
  const lines = store.state.lines.filter((l) => l.client.id === oldClient.id);

  if (lines.length > 0) {
    for (const l of lines) {
      const ca = calcCA(l.dtt, newClient.th);
      const hourly = l.hourly.map((h) => {
        return { ...h, id: Date.now() };
      });
      const line = {
        id: Date.now(),
        date: l.date,
        hourly: hourly,
        dtt: l.dtt,
        note: l.note,
        client: {
          id: newClient.id,
          name: newClient.name,
          color: newClient.color,
          th: newClient.th,
          chrg: newClient.chrg,
          ca: ca,
          bnf: calcBNF(ca, newClient.chrg),
          billed: l.client.billed,
          paid: l.client.paid,
          dop: l.client.dop,
        },
      };
      try {
        await addLine(store, line, 1);
        await removeLine(store, l);
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }
}
