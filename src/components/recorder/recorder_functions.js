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
import { durationTime } from "@/functions/time_functions.js";

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
    stp: new Date("2024-07-20T00:00:00"),
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
        saveRecord(store);
      }
    }
  }
}

// Close record
export function saveRecord(store) {
  // Get data
  const formInfos = computed(() =>
    JSON.parse(localStorage.getItem("recordFormInfos"))
  );

  const records = computed(() => store.state.records);

  checkTimeRange(records.value);

  const forms = createForms(records.value);
  console.log("forms:", forms);

  const data = createData(store, formInfos.value);
  console.log("data:", data);

  setRecStatus(store, "off");
}

// Data processing
function checkTimeRange(records) {
  for (let r of records) {
    const sameYear = computed(
      () => r.str.getFullYear() === r.stp.getFullYear()
    );
    const sameMonth = computed(() => r.str.getMonth() === r.stp.getMonth());
    const sameDate = computed(() => r.str.getDate() === r.stp.getDate());
    if (sameYear.value && sameMonth.value && sameDate.value) {
      console.log("Jour identique");
    } else {
      const interDates = [];
      let currentDate = new Date(r.str);
      const endDate = new Date(r.stp);
      while (currentDate < endDate) {
        interDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      console.log("interDates:", interDates);
    }
  }
}

function createForms(records) {
  let forms = [];

  for (let h of records) {
    const Hstr = computed(() => {
      let result = String(h.str.getHours());
      return result.length < 2 ? `0${result}` : result;
    });
    const Mstr = computed(() => {
      let result = String(h.str.getMinutes());
      return result.length < 2 ? `0${result}` : result;
    });
    const Hstp = computed(() => {
      let result = String(h.stp.getHours());
      return result.length < 2 ? `0${result}` : result;
    });
    const Mstp = computed(() => {
      let result = String(h.stp.getMinutes());
      return result.length < 2 ? `0${result}` : result;
    });

    const hourly = {
      id: h.id,
      Hstr: Hstr.value,
      Mstr: Mstr.value,
      Hstp: Hstp.value,
      Mstp: Mstp.value,
      duration: durationTime(Hstr.value, Mstr.value, Hstp.value, Mstp.value),
    };

    forms.push(hourly);
  }

  return forms;
}

function createData(store, data) {
  const client = store.state.clients.find((c) => c.name === data.clientName);
  return {
    client: {
      billed: false,
      chrg: client.chrg,
      color: client.color,
      dop: null,
      id: client.id,
      name: client.name,
      paid: false,
      th: client.th,
    },
    note: data.note,
  };
}
