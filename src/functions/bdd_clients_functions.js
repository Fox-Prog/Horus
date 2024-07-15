import "core-js/features/promise";

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;
// Add into vuex
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
async function addClientLocal(client) {
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
async function removeClientLocal(clientToRemove) {
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
