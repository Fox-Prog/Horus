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
  try {
    const request = indexedDB.open("horusDB", 1);

    request.onerror = (err) => {
      console.log("Error with IndexedDB: ", err);
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("records", "readwrite");
      const recordsDB = transaction.objectStore("records");

      const getRequest = recordsDB.get(playload.id);

      getRequest.onsuccess = () => {
        const existingRecord = getRequest.result;

        if (existingRecord) {
          Object.assign(existingRecord, playload);

          const putRequest = recordsDB.put(existingRecord);

          putRequest.onerror = (err) => {
            console.log("Error updating record: ", err);
          };
        } else {
          console.log("record not found in the database");
        }
      };

      getRequest.onerror = (err) => {
        console.log("Error getting record: ", err);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
  } catch (err) {
    console.log("Error with IndexedDB: ", err);
    throw err;
  }
}
