import "core-js/features/promise";

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

// Add into vuex
// Lines
export async function addLine(store, line, mode) {
  try {
    await store.dispatch("addLine", line);
    if (mode === 1) {
      await addLineLocal(line);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// Clients
export async function addClient(store, client, mode) {
  try {
    await store.dispatch("addClient", client);
    if (mode === 1) {
      await addClientLocal(client);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Add into indexedDB
// Lines
export async function addLineLocal(line) {
  try {
    const request = indexedDB.open("horusDB", 1);

    request.onerror = (err) => {
      console.log("Error with IndexedDB: ", err);
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("lines", "readwrite");
      const linesDB = transaction.objectStore("lines");

      linesDB.put(line);

      transaction.oncomplete = () => {
        db.close();
      };
    };
  } catch (err) {
    console.log("Error with IndexedDB: ", err);
    throw err;
  }
}
// Clients
export async function addClientLocal(client) {
  try {
    const request = indexedDB.open("horusDB", 1);

    request.onerror = (err) => {
      console.log("Error with IndexedDB: ", err);
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("clients", "readwrite");
      const clientsDB = transaction.objectStore("clients");

      clientsDB.put(client);

      transaction.oncomplete = () => {
        db.close();
      };
    };
  } catch (err) {
    console.log("Error with IndexedDB: ", err);
    throw err;
  }
}

// Remove into vuex
// Lines
export async function removeLine(store, line) {
  try {
    const index = store.state.lines.findIndex((l) => l === line);

    await store.dispatch("removeLine", index);
    await removeLineLocal(line);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// Clients
export async function removeClient(store, client) {
  try {
    const index = store.state.clients.findIndex((l) => l === client);

    await store.dispatch("removeClient", index);
    await removeClientLocal(client);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Remove into IndexedDB
// Lines
export async function removeLineLocal(lineToRemove) {
  try {
    const request = indexedDB.open("horusDB", 1);

    request.onerror = (err) => {
      console.error("Error with IndexedDB: ", err);
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("lines", "readwrite");
      const linesDB = transaction.objectStore("lines");

      linesDB.delete(lineToRemove.id);

      transaction.oncomplete = () => {
        db.close();
      };
    };
  } catch (err) {
    console.error("Error with IndexedDB: ", err);
    throw err;
  }
}
// Clients
export async function removeClientLocal(clientToRemove) {
  try {
    const request = indexedDB.open("horusDB", 1);

    request.onerror = (err) => {
      console.error("Error with IndexedDB: ", err);
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("clients", "readwrite");
      const clientsDB = transaction.objectStore("clients");

      clientsDB.delete(clientToRemove.id);

      transaction.oncomplete = () => {
        db.close();
      };
    };
  } catch (err) {
    console.error("Error with IndexedDB: ", err);
    throw err;
  }
}

// Charge Vuex with IndexedDB
// Lines
export async function getLinesLocal(store) {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open("horusDB", 1);

      request.onerror = (err) => {
        console.error("Error with IndexedDB: ", err);
        reject(err);
      };

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("lines", "readonly");
        const linesDB = transaction.objectStore("lines");

        const requestAllData = linesDB.getAll();

        requestAllData.onerror = (err) => {
          console.error("Error with IndexedDB: ", err);
          reject(err);
        };

        requestAllData.onsuccess = () => {
          const data = requestAllData.result;
          for (let line of data) {
            addLine(store, line, 2);
          }
          resolve();
        };
      };
    } catch (err) {
      console.error("Error with IndexedDB: ", err);
      reject(err);
    }
  });
}
// Clients
export async function getClientsLocal(store) {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open("horusDB", 1);

      request.onerror = (err) => {
        console.error("Error with IndexedDB: ", err);
        reject(err);
      };

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("clients", "readonly");
        const clientsDB = transaction.objectStore("clients");

        const requestAllData = clientsDB.getAll();

        requestAllData.onerror = (err) => {
          console.error("Error with IndexedDB: ", err);
          reject(err);
        };

        requestAllData.onsuccess = () => {
          const data = requestAllData.result;
          for (let client of data) {
            addClient(store, client, 2);
          }
          resolve();
        };
      };
    } catch (err) {
      console.error("Error with IndexedDB: ", err);
      reject(err);
    }
  });
}
