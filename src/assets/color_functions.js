export function getColorMode(store) {
  const colorMode = localStorage.getItem("colorMode");

  if (!colorMode) {
    localStorage.setItem("colorMode", "dark_mode");
    store.dispatch("setColorMode", "dark_mode");
    return "dark_mode";
  }

  store.dispatch("setColorMode", colorMode);
  return colorMode;
}

export function setColorMode(store, colorMode) {
  // Inversion
  let cm = null;
  if (colorMode === "dark_mode") {
    cm = "light_mode";
  } else {
    cm = "dark_mode";
  }
  store.dispatch("setColorMode", cm);
  localStorage.setItem("colorMode", cm);
}
