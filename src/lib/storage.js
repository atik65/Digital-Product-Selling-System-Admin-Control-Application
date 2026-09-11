import { decrypt, encrypt } from "./encryptDecrypt";

function hasWindowStorage() {
  return typeof window !== "undefined" && !!window?.localStorage;
}

export function getStoredValue(name, defaultValue = null) {
  // if (!hasWindowStorage()) return defaultValue;
  try {
    const raw = window.localStorage.getItem(name);
    if (!raw) return defaultValue;
    const decrypted = decrypt(raw);
    return decrypted !== null ? decrypted : defaultValue;
  } catch (error) {
    console.error("Failed to read localStorage", error);
    return defaultValue;
  }
}

export function setStoredValue(name, value) {
  if (!hasWindowStorage()) return;
  try {
    const encrypted = encrypt(value);
    window.localStorage.setItem(name, encrypted);
  } catch (error) {
    console.error("Failed to write localStorage", error);
  }
}

export function removeStoredValue(name) {
  if (!hasWindowStorage()) return;
  try {
    window.localStorage.removeItem(name);
  } catch (error) {
    console.error("Failed to remove localStorage key", error);
  }
}

/* 
    const user = getStoredValue('user', { name: '', age: 0 });
    setStoredValue('user', { name: 'John Doe', age: 30 });
    removeStoredValue('user');
*/
