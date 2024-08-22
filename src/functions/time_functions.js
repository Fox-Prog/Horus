// Convertion minutes en heures
export function minsToHours(sum) {
  const Htt = Math.floor(sum / 60);
  const sendHtt = Htt < 10 ? `0${Htt}` : Htt;
  const Mtt = sum % 60;
  const sendMtt = Mtt < 10 ? `0${Mtt}` : Mtt;

  return `${sendHtt}:${sendMtt}`;
}

// Convertion heures en décimal
export function hoursToHdec(h) {
  const hTom = parseInt(h.split(":")[0]);
  const mm = parseFloat(h.split(":")[1] / 60);
  return hTom + mm;
}

// Addition d'horaires
export function addTime(tab) {
  let tabMinutes = [];
  for (const d of tab) {
    tabMinutes.push(parseInt(d.split(":")[0] * 60) + parseInt(d.split(":")[1]));
  }

  const sum = tabMinutes.reduce((acc, val) => {
    return acc + val;
  });

  return minsToHours(sum);
}

// Calcul durée entre 2 horaires
export function durationTime(Hstr, Mstr, Hstp, Mstp) {
  const start = new Date(`2000-01-01T${Hstr}:${Mstr}:00`);
  const stop = new Date(`2000-01-01T${Hstp}:${Mstp}:00`);
  const diff = stop - start;

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  return `${hours}:${minutes}`;
}
