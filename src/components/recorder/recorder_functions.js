// Import
import {
  addRecord,
  setRecord,
} from "@/components/recorder/bdd_recorder_functions.js";
import { setLoader } from "@/functions/dialog_functions.js";
import {
  setRecStatus,
  setRecID,
} from "@/components/recorder/bdd_recorder_functions";

// Import vue fonctions
import { computed } from "vue";

// Create record
export async function createRecord(store, t) {
  const record = {
    id: Date.now(),
    str: new Date(),
  };

  let success = false;

  try {
    await addRecord(store, record, 1);
    setRecID(store, record.id);
    success = true;
  } catch (error) {
    console.log(error);
    setLoader(
      store,
      {
        dialog: true,
        mode: "err",
        error: t.txt_error_add_record,
      },
      0
    );
    success = false;
  } finally {
    if (success) {
      setRecStatus(store, "start");
    }
  }
}

// Set record
export async function modifyRecord(store, t, recID, mode) {
  const record = store.state.records.find((r) => r.id === recID);
  const playload = {
    id: Number(record.id),
    str: new Date(record.str),
    stp: new Date(),
  };

  let success = false;

  try {
    await setRecord(store, playload);
    success = true;
  } catch (error) {
    console.log(error);
    setLoader(
      store,
      {
        dialog: true,
        mode: "err",
        error: t.txt_error_record,
      },
      0
    );
    success = false;
  } finally {
    if (success) {
      setRecID(store, null);
      if (mode === 1) {
        // Mode set
        setRecStatus(store, "pause");
      } else {
        // Mode stop
        closeRecord(store);
      }
    }
  }
}

// Close record
export function closeRecord(store) {
  const data = computed(() => store.state.records);
  console.log("data:", data.value);
  setRecStatus(store, "off");
}
