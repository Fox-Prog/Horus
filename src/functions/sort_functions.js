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
export function monthFocus(year) {
  const monthList = year.map((l) => {
    try {
      return l.date.getMonth();
    } catch (error) {
      console.log(error);
    }
  });

  const uniqueMonth = monthList.reduce((acc, curr) => {
    if (!acc.includes(curr)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  return uniqueMonth.sort((a, b) => a - b);
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
