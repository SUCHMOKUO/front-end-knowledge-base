export function isClass(clazz) {
  if (typeof clazz !== "function") {
    return false;
  }
  const str = clazz.toString();
  return str.slice(0, 5) === "class";
}

export function isEventProp(propName) {
  return String(propName).slice(0, 2) === "on";
}

export function getEventName(propName) {
  return propName.slice(2).toLowerCase();
}