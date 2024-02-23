import { hoursToHdec } from "./time_functions";

export function calcCA(dtt, th) {
  const hdec = hoursToHdec(dtt);
  const ca = parseFloat(th) * hdec;
  return ca.toFixed(2).replace(".", ",");
}

export function sumCA(listCA) {
  if (listCA.length > 1) {
    return listCA
      .reduce((acc, ca) => {
        return parseFloat(acc) + parseFloat(ca);
      })
      .toFixed(2)
      .replace(".", ",");
  } else {
    return listCA[0].replace(".", ",");
  }
}

export function calcBNF(ca, chrg) {
  const div = parseFloat(chrg) / 100;
  const taxe = parseFloat(ca) * div;
  return parseFloat(ca) - taxe;
}

export function sumBNF(listBNF) {
  if (listBNF.length > 1) {
    return listBNF
      .reduce((acc, bnf) => {
        return parseFloat(acc) + parseFloat(bnf);
      })
      .toFixed(2)
      .replace(".", ",");
  } else {
    return String(listBNF[0]).replace(".", ",");
  }
}
