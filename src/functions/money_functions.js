import { hoursToHdec } from "./time_functions";

export function calcCA(dtt, th) {
  const hdec = hoursToHdec(dtt);
  const ca = parseFloat(th) * hdec;
  return ca;
}

export function sumCA(listCA) {
  if (listCA.length > 1) {
    return listCA.reduce((acc, ca) => {
      return acc + ca;
    });
  } else {
    return listCA[0];
  }
}

export function calcBNF(ca, chrg) {
  const div = parseFloat(chrg) / 100;
  const taxe = ca * div;
  if (taxe === 0) {
    return ca;
  }
  return ca - taxe;
}

export function sumBNF(listBNF) {
  if (listBNF.length > 1) {
    return listBNF.reduce((acc, bnf) => {
      return acc + bnf;
    });
  } else {
    return listBNF[0];
  }
}
