import { removeLine } from "@/functions/bdd_functions.js";

export function removeLinesOfClient(store, client) {
  // Need ID of client
  const lines = store.state.lines.filter((l) => l.client.id === client);
  if (lines.length > 0) {
    lines.forEach((l) => {
      removeLine(store, l);
    });
  }
}
