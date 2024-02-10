export function newForm(forms) {
  const newID =
    forms.reduce((maxID, f) => {
      return Math.max(maxID, f.id);
    }, 0) + 1;
  return {
    id: newID,
    status: false,
  };
}
