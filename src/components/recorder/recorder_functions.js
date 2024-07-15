export function getRecStatus(store) {
  const recStatus = localStorage.getItem("recStatus");

  if (!recStatus) {
    localStorage.setItem("recStatus", "off");
    store.dispatch("setRecStatus", "off");
    return "off";
  }

  store.dispatch("setRecStatus", recStatus);
  return recStatus;
}

export function setRecStatus(store, recStatus) {
  store.dispatch("setRecStatus", recStatus);
  localStorage.setItem("recStatus", recStatus);
}
