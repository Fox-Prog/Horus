// Import
import {
  addRecord,
  setRecord,
  clearRecords,
} from "@/components/recorder/bdd_recorder_functions.js";
import { setLoader } from "@/functions/dialog_functions.js";
import {
  setRecStatus,
  setRecID,
} from "@/components/recorder/bdd_recorder_functions";
import { durationTime } from "@/functions/time_functions.js";
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();

// Import vue fonctions
import { computed } from "vue";
import { createLines } from "@/functions/create_functions";

// Create record
export async function createRecord(store, t) {
  return new Promise((resolve, reject) => {
    const record = {
      id: Date.now(),
      str: new Date(),
    };

    try {
      addRecord(store, record, 1);
      setRecID(store, record.id);
      setRecStatus(store, "start");
      resolve();
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
      reject(error);
    }
  });
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
        // Mode
        setLoader(store, { dialog: true, mode: "wait" }, 0);
        setTimeout(() => {
          saveRecord(store);
        }, 800);
      }
    } else {
      setRecStatus(store, "off");
    }
  }
}

// Save record
export async function saveRecord(store) {
  const loaderTime = store.state.loaderTime;

  // Get data
  const formInfos = computed(() =>
    JSON.parse(localStorage.getItem("recordFormInfos"))
  );

  const records = computed(() => store.state.records);
  const fRec = formatRecords(records.value);

  const forms = createForms(fRec);

  const data = createData(store, formInfos.value);

  let success = false;
  try {
    for (let f of forms) {
      await createLines(store, f.hourly, f.date, data, 1, null);
    }
    await clearRecords(store);
    setLoader(store, { dialog: true, mode: "success" }, 0);
    success = true;
  } catch (error) {
    console.log(error);
    setLoader(
      store,
      {
        dialog: true,
        mode: "err",
        error: `${t.txt_error_record}: ${t.txt_error_add_line}`,
      },
      0
    );
    success = false;
  } finally {
    if (success) {
      setLoader(store, { dialog: false, mode: "success" }, loaderTime);
    }
    setRecStatus(store, "off");
  }
}

// Data processing
function formatRecords(records) {
  let formatRecords = [];

  for (let r of records) {
    const sameYear = computed(
      () => r.str.getFullYear() === r.stp.getFullYear()
    );
    const sameMonth = computed(() => r.str.getMonth() === r.stp.getMonth());
    const sameDate = computed(() => r.str.getDate() === r.stp.getDate());
    // If same day
    if (sameYear.value && sameMonth.value && sameDate.value) {
      formatRecords.push(r);
    } else {
      // Not same day
      const interDates = [];
      let currentDate = new Date(r.str);
      const endDate = new Date(r.stp);
      while (
        new Date(currentDate).setHours(0, 0, 0, 0) <
        new Date(endDate).setHours(0, 0, 0, 0)
      ) {
        interDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      interDates.push(new Date(endDate));

      for (let d of interDates) {
        const dCopied = new Date(d);
        let ssd = {};
        // First
        if (d === interDates[0]) {
          ssd = {
            id: r.id,
            str: new Date(dCopied),
            stp: new Date(dCopied.setHours(23, 59, 0, 0)),
          };
          // Last
        } else if (d === interDates.at(-1)) {
          ssd = {
            id: r.id,
            stp: new Date(dCopied),
            str: new Date(dCopied.setHours(0, 0, 0, 0)),
          };
          // Middle
        } else {
          ssd = {
            id: r.id,
            str: new Date(dCopied.setHours(0, 0, 0, 0)),
            stp: new Date(dCopied.setHours(23, 59, 0, 0)),
          };
        }

        formatRecords.push(ssd);
      }
    }
  }

  return formatRecords;
}

function createForms(records) {
  let forms = {};

  for (let h of records) {
    const strCopied = new Date(h.str);
    const date = new Date(strCopied.setHours(0, 0, 0, 0));
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

    if (!forms[date]) {
      forms[date] = { date: [date], hourly: [] };
    }

    forms[date].hourly.push(hourly);
  }
  return Object.values(forms);
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
