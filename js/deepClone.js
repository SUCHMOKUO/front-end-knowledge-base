function isRefType(val) {
  return val instanceof Object;
}

function deepClone(obj, cloneObjMap = new WeakMap(), parent = null) {
  // 非引用类型直接复制
  if (!isRefType(obj)) {
    return obj;
  }

  // 循环引用判断
  let _parent = parent;
  while (_parent) {
    if (_parent.parent === obj) {
      return _parent.clone;
    }
    _parent = _parent.prev;
  }

  // 多个键指向同一个对象，只克隆一次
  if (cloneObjMap.has(obj)) {
    return cloneObjMap.get(obj);
  }

  let res;
  const cloneParent = {
    prev: parent,
    parent: obj,
  };

  if (Array.isArray(obj)) {
    res = [];
    cloneParent.clone = res;
    for (const item of obj) {
      res.push(deepClone(item, cloneObjMap, cloneParent));
    }
  } else {
    res = Object.create(Reflect.getPrototypeOf(obj));
    cloneParent.clone = res;
    for (const [k, v] of Object.entries(obj)) {
      res[k] = deepClone(v, cloneObjMap, cloneParent);
    }
  }

  cloneObjMap.set(obj, res);
  return res;
}

const obj = {
  a: 1,
  b: {
    c: 2,
  },
};

const obj2 = {
  a: obj,
  b: {
    c: obj,
  },
  e: [obj],
};

obj2.d = obj2;
obj2.e.push(obj2);

const cloneObj2 = deepClone(obj2);
console.log(cloneObj2 !== obj2);
console.log(cloneObj2.a === cloneObj2.b.c);
console.log(cloneObj2.e[0] === cloneObj2.a);
console.log(cloneObj2.e[1] === cloneObj2);
console.log(cloneObj2);
