import "core-js/features/promise";

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

// Add into vuex
export async function addRecord(store, record, mode) {
  try {
    await store.dispatch("addRecord", record);
    if (mode === 1) {
      await addRecordLocal(record);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Add into indexedDB
async function addRecordLocal(record) {
  try {
    const request = indexedDB.open("horusDB", 1);

    request.onerror = (err) => {
      console.log("Error with IndexedDB: ", err);
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("records", "readwrite");
      const recordsDB = transaction.objectStore("records");

      recordsDB.put(record);

      transaction.oncomplete = () => {
        db.close();
      };
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Set into Vuex
export async function setRecord(store, playload) {
  try {
    await store.dispatch("setRecord", playload);
    await setRecordLocal(playload);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Set into indexedDB
async function setRecordLocal(playload) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("horusDB", 1);

    request.onerror = (err) => {
      console.log("Error with IndexedDB: ", err);
      reject(err);
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("records", "readwrite");
      const recordsDB = transaction.objectStore("records");

      const getRequest = recordsDB.get(playload.id);

      getRequest.onerror = (err) => {
        console.log("Error getting record: ", err);
        reject(err);
      };

      getRequest.onsuccess = () => {
        const existingRecord = getRequest.result;

        if (existingRecord) {
          Object.assign(existingRecord, playload);
          const putRequest = recordsDB.put(existingRecord);

          putRequest.onerror = (err) => {
            console.log("Error updating record: ", err);
            reject(err);
          };

          putRequest.onsuccess = () => {
            transaction.oncomplete = () => {
              db.close();
              resolve();
            };
          };
        } else {
          console.log("Record not found in the database");
          reject(new Error());
        }
      };
    };
  });
}

// Charge Vuex with IndexedDB
export async function getRecordsLocal(store) {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open("horusDB", 1);

      request.onerror = (err) => {
        console.error("Error with IndexedDB: ", err);
        reject(err);
      };

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("records", "readonly");
        const recordsDB = transaction.objectStore("records");

        const requestAllData = recordsDB.getAll();

        requestAllData.onerror = (err) => {
          console.error("Error with IndexedDB: ", err);
          reject(err);
        };

        requestAllData.onsuccess = () => {
          const data = requestAllData.result;
          for (let record of data) {
            addRecord(store, record, 2);
          }
          resolve();
        };
      };
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

// Recorder status
export function getRecStatus(store) {
  const recStatus = localStorage.getItem("recStatus");

  if (!recStatus) {
    localStorage.setItem("recStatus", "off");
    store.dispatch("setRecStatus", "off");
    return "off";
  }

  store.dispatch("setRecStatus", recStatus);
  return recStatus;
}

export function setRecStatus(store, recStatus) {
  store.dispatch("setRecStatus", recStatus);
  localStorage.setItem("recStatus", recStatus);
}

// Recorder ID
export function getRecID(store) {
  const recID = localStorage.getItem("recID");

  if (!recID) {
    localStorage.setItem("recID", null);
    store.dispatch("setRecID", null);
    return null;
  }

  store.dispatch("setRecID", recID);
  return recID;
}

export function setRecID(store, recID) {
  store.dispatch("setRecID", recID);
  localStorage.setItem("recID", recID);
}

// Clear indexedDB
export async function clearRecords(store) {
  try {
    await store.dispatch("clearRecords");
    await clearRecordsLocal();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function clearRecordsLocal() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("horusDB", 1);

    request.onerror = (err) => {
      console.log("Error with IndexedDB: ", err);
      reject(err);
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("records", "readwrite");
      const objectStore = transaction.objectStore("records");

      const clearRequest = objectStore.clear();

      clearRequest.onerror = (err) => {
        console.log("Error clearing object store: ", err);
        reject(err);
      };

      clearRequest.onsuccess = () => {
        transaction.oncomplete = () => {
          db.close();
          resolve();
        };
      };
    };
  });
}
