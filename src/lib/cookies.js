import Cookies from "js-cookie";

export function getCookie(name, defaultValue = null) {
  return Cookies.get(name) || defaultValue;
}

export function setCookie(name, value, options) {
  Cookies.set(name, value, options);
}

export function removeCookie(name, options) {
  Cookies.remove(name, options);
}

/*
Usage:

import { getCookie, setCookie, removeCookie } from '@/utils/cookies';

const user = getCookie('user', { name: '', age: 0 });
setCookie('user', { name: 'John Doe', age: 30 }, { expires: 7 });
removeCookie('user');
*/

// NB: If httpOnly is set to true in options, the cookie will not be accessible via JavaScript.
