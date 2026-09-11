import config from "@/config/base";
import CryptoJS from "crypto-js";

export function encrypt(data) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    config.cryptojsSecretKey
  ).toString();
}

export function decrypt(encryptedData) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, config.cryptojsSecretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    return null;
  }
}
