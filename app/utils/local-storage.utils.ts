export function getFromLocalStorage<T>(key: string): T | null {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function saveToLocalStorage<T>(key: string, value: T): T | null {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
} 