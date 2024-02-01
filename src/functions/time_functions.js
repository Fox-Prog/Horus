export function addTime(tab) {
  let tabMinutes = [];
  for (const d of tab) {
    tabMinutes.push(parseInt(d.split(":")[0] * 60) + parseInt(d.split(":")[1]));
  }

  const sum = tabMinutes.reduce((acc, val) => {
    return acc + val;
  });

  const Htt = Math.floor(sum / 60);
  const sendHtt = Htt < 10 ? `0${Htt}` : Htt;
  const Mtt = sum % 60;
  const sendMtt = Mtt < 10 ? `0${Mtt}` : Mtt;

  return `${sendHtt} : ${sendMtt}`;
}
