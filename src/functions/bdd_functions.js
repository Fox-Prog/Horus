import "core-js/features/promise";

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

// Add into vuex

export function addLine(store, line, mode) {
  store.dispatch("addLine", line);
  if (mode === 1) {
    addLineLocal(line);
  }
}

// Add into indexedDB

export function addLineLocal(line) {
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
  }
}

// Remove into vuex
export function removeLine(store, line) {
  const index = store.state.lines.findIndex((l) => l === line);

  store.dispatch("removeLine", index);
  removeLineLocal(line);
}

// Remove into IndexedDB

export function removeLineLocal(lineToRemove) {
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
  }
}

// Charge Vuex with IndexedDB

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
