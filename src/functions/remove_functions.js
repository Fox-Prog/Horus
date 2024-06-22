import { removeLine } from "@/functions/bdd_functions.js";

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
