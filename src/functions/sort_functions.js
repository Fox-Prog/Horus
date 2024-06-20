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

  // Sort
  const sortedGroupsArray = Object.entries(groups).sort((a, b) => {
    const nameA = a[1][0].name.toLowerCase();
    const nameB = b[1][0].name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  // Array to Object
  const sortedGroups = {};
  sortedGroupsArray.forEach(([client, group]) => {
    sortedGroups[client] = group;
  });

  return sortedGroups;
}
