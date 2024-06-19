// Regroupement des lignes par année
export function yearFocus(lines) {
  const groups = {};

  lines.forEach((obj) => {
    const year = obj.date.getFullYear();
    if (!groups[year]) {
      groups[year] = [
        {
          name: year,
        },
      ];
    }
    groups[year].push(obj);
  });

  return groups;
}

// Regroupement par mois + tri croissant
export function monthFocus(lines) {
  const groups = {};

  lines.forEach((obj) => {
    const month = obj.date.getMonth();
    if (!groups[month]) {
      groups[month] = [
        {
          name: month,
        },
      ];
    }
    groups[month].push(obj);
  });

  return groups;
}

// Regroupement par client
export function clientFocus(lines) {
  const groups = {};

  lines.forEach((obj) => {
    const client = obj.client.name;
    if (!groups[client]) {
      groups[client] = [
        {
          name: client,
        },
      ];
    }
    groups[client].push(obj);
  });
  return groups;
}
