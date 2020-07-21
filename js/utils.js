function isReferenceType(val) {
  return (val !== null && typeof val === "object") || typeof val === "function";
}

module.exports.isReferenceType = isReferenceType;
