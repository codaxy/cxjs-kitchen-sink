import { isObject } from "cx/util";

export function isNonEmptyObjectDeep(o) {
  if (o == null) return false;
  if (isObject(o)) {
    for (let k in o) {
      if (isNonEmptyObjectDeep(o[k])) return true;
    }
    return false;
  }
  return true;
}
