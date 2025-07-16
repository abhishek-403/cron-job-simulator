export function addToLocalStore(key: string, value: string) {
  localStorage.setItem(key, value);
  return;
}
export function fetchFromLocalStore(key: string) {
  return localStorage.getItem(key);
}
export function removeFromLocalStore(key: string) {
  localStorage.removeItem(key);
  return;
}
export function clearLocalStore() {
  localStorage.clear();
  return;
}
