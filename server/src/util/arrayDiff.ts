import * as equal from 'deep-equal';

export function arrayDiff<T, Key>(
   before: T[],
   after: T[],
   keyFn: (record: T) => Key
): {
   added: T[];
   removed: T[];
   changed: { before: T; after: T; key: Key }[];
   unchanged: T[];
} {
   var map = new Map();

   for (let i = 0; i < before.length; i++) map.set(keyFn(before[i]), before[i]);

   var added = [],
      changed = [],
      unchanged = [];

   for (let i = 0; i < after.length; i++) {
      let el = after[i];
      let key = keyFn(el);
      let old = map.get(key);
      if (old == undefined) added.push(el);
      else {
         map.delete(key);
         if (equal(el, old)) unchanged.push(el);
         else
            changed.push({
               key,
               before: old,
               after: el,
            });
      }
   }

   var removed = Array.from(map.values());

   return {
      added,
      changed,
      unchanged,
      removed,
   };
}
