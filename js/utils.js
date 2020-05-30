function isObject(val) {
  return val !== null && typeof val === "object";
}

module.exports = {
  isObject
}