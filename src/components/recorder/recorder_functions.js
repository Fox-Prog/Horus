// Import
import { setLoader } from "@/functions/dialog_functions.js";
import {
  addRecord,
  setRecord,
  setRecStatus,
  setRecID,
  clearRecords,
} from "@/components/recorder/bdd_recorder_functions";
import { durationTime, addTime, formatHM } from "@/functions/time_functions.js";
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
      resetRecord(store);
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
    // stp: new Date("2024-08-30T14:30:00"),
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
    resetRecord(store);
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
    resetRecord(store);
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
      const interDates = createInterDates(r.str, r.stp);

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

// Inter dates
function createInterDates(str, stp) {
  const interDates = [];

  let currentDate = new Date(str);
  const endDate = new Date(stp);
  while (
    new Date(currentDate).setHours(0, 0, 0, 0) <
    new Date(endDate).setHours(0, 0, 0, 0)
  ) {
    interDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  interDates.push(new Date(endDate));
  return interDates;
}

function formatInterDates(interDates) {
  const formatedDates = [];

  for (let d of interDates) {
    const dCopied = new Date(d);
    let ssd = {};
    // First
    if (d === interDates[0]) {
      ssd = {
        id: Date.now(),
        str: new Date(dCopied),
        stp: new Date(dCopied.setHours(23, 59, 0, 0)),
      };
      // Last
    } else if (d === interDates.at(-1)) {
      ssd = {
        id: Date.now(),
        stp: new Date(dCopied),
        str: new Date(dCopied.setHours(0, 0, 0, 0)),
      };
      // Middle
    } else {
      ssd = {
        id: Date.now(),
        str: new Date(dCopied.setHours(0, 0, 0, 0)),
        stp: new Date(dCopied.setHours(23, 59, 0, 0)),
      };
    }

    formatedDates.push(ssd);
  }
  return formatedDates;
}

function createForms(records) {
  let forms = {};

  for (let h of records) {
    const strCopied = new Date(h.str);
    const date = new Date(strCopied.setHours(0, 0, 0, 0));
    const Hstr = computed(() => {
      return formatHM(h.str.getHours());
    });
    const Mstr = computed(() => {
      return formatHM(h.str.getMinutes());
    });
    const Hstp = computed(() => {
      return formatHM(h.stp.getHours());
    });
    const Mstp = computed(() => {
      return formatHM(h.stp.getMinutes());
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

// Reset record
export async function resetRecord(store) {
  localStorage.setItem("chrono", null);
  setRecStatus(store, "off");
  localStorage.setItem(
    "recordFormInfos",
    JSON.stringify({
      clientName: null,
      noteField: null,
      note: null,
    })
  );
  await clearRecords(store);
}

// CHRONO
export function updateChrono(store) {
  const recStatus = computed(() => store.state.recStatus);
  const recID = computed(() => parseInt(store.state.recID));
  const savedChrono = localStorage.getItem("chrono");
  if (!savedChrono) {
    localStorage.setItem("chrono", null);
  }

  if (recStatus.value === "start") {
    try {
      const str = new Date(
        store.state.records.find((r) => r.id === recID.value).str
      );
      const now = new Date();
      // const now = new Date(new Date().setHours(19, 50, 2, 0));
      let dtt;

      if (str.getDate() === now.getDate()) {
        dtt = durationTime(
          formatHM(str.getHours()),
          formatHM(str.getMinutes()),
          formatHM(now.getHours()),
          formatHM(now.getMinutes())
        );
      } else {
        const interDates = createInterDates(str, now);
        const fid = formatInterDates(interDates);
        const durations = fid.map((d) => {
          const hstr = formatHM(d.str.getHours());
          const mstr = formatHM(d.str.getMinutes());
          const hstp = formatHM(d.stp.getHours());
          const mstp = formatHM(d.stp.getMinutes());
          return durationTime(hstr, mstr, hstp, mstp);
        });
        dtt = addTime(durations);
      }

      const hh = formatHM(dtt.split(":")[0]);
      const mm = formatHM(dtt.split(":")[1]);
      const ss = formatHM(now.getSeconds());
      if (savedChrono !== "null") {
        const addChrono = addTime([
          `${savedChrono.split(":")[0]}:${savedChrono.split(":")[1]}`,
          `${hh}:${mm}`,
        ]);
        return `${addChrono.split(":")[0]}:${addChrono.split(":")[1]}:${ss}`;
      } else {
        return `${hh}:${mm}:${ss}`;
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    if (savedChrono !== "null") {
      return savedChrono;
    } else {
      return "00:00:00";
    }
  }
}
