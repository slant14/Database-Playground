export function getCookie(name) {
    for (const entryString of document.cookie.split(";")) {
      const [entryName, entryValue] = entryString.split("=");
      if (decodeURIComponent(entryName && entryName.trim()) === name) {
        return entryValue ? decodeURIComponent(entryValue) : entryValue;
      }
    }
    return undefined;
}

export function setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const expiresString = expires.toUTCString();
    
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expiresString}; path=/`;
}

export function deleteCookie(name) {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// LocalStorage functions
export function getFromLocalStorage(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error(`Failed to parse localStorage item ${key}:`, error);
        return null;
    }
}

export function setToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Failed to set localStorage item ${key}:`, error);
    }
}

export function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Failed to remove localStorage item ${key}:`, error);
    }
}