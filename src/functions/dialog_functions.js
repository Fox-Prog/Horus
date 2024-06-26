export function setLoader(store, loader, delay) {
  setTimeout(() => {
    store.dispatch("setLoader", loader);
  }, delay);
}
