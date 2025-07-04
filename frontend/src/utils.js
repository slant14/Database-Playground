export function getCookie(name) {
    for (const entryString of document.cookie.split(";")) {
      const [entryName, entryValue] = entryString.split("=");
      if (decodeURIComponent(entryName && entryName.trim()) === name) {
        return entryValue;
      }
    }
    return undefined;
  }