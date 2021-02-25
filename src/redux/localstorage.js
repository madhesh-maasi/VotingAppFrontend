// localStorage.js
export const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('user_info');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}; 

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem('user_info', serializedState);
  } catch {
    // ignore write errors
  }
};