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
import { ref, computed } from "vue";

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
    // "2024-07-21T16:26:12"
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
  // const formInfos = computed(() =>
  //   JSON.parse(localStorage.getItem("recordFormInfos"))
  // );

  const records = computed(() => store.state.records);
  const fRec = formatRecords(records.value);
  console.log("fRec:", fRec);

  const forms = createForms(fRec);
  console.log("forms:", forms);

  test(forms);

  // const data = createData(store, formInfos.value);
  // console.log("data:", data);

  setRecStatus(store, "off");
}

function test(forms) {
  console.log("Test ON");
  for (let f of forms) {
    const date = f.date;
    console.log("date:", date);
    const hourly = f.hourly;
    console.log("hourly:", hourly);
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
      while (currentDate < endDate) {
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
  let forms = ref([]);

  for (let h of records) {
    const date = new Date(h.str.setHours(0, 0, 0, 0));
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

    const index = computed(() => {
      for (let i = 0; i < forms.value.length; i++) {
        if (forms.value[i][0] === date) {
          return i;
        }
      }
      forms.value.push({ date: date, hourly: [] });
      return forms.value.length - 1;
    });

    forms.value[index.value].hourly.push(hourly);
  }

  return forms.value;
}

// function createData(store, data) {
//   const client = store.state.clients.find((c) => c.name === data.clientName);
//   return {
//     client: {
//       billed: false,
//       chrg: client.chrg,
//       color: client.color,
//       dop: null,
//       id: client.id,
//       name: client.name,
//       paid: false,
//       th: client.th,
//     },
//     note: data.note,
//   };
// }
