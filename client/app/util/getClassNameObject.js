import { isString } from "cx/util";

export function getClassNameObject(x) {
  if (isString(x)) {
    let parts = x.split(" ");
    let result = {};
    parts.forEach(p => {
      if (p) result[p] = true;
    });
    return result;
  }
  return x || {};
}
