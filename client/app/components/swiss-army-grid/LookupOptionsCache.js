import { isBinding, Binding, computable } from 'cx/data';
import { arrayToMap } from '../../util/arrayToMap';
import { isArray } from 'cx/util';

export class LookupOptionsCache {
   constructor({ store, storage }) {
      this.lookups = {};
      this.store = store;
      this.storage = storage;
   }

   register(field, lookup) {
      if (!isBinding(this.storage))
         throw new Error(
            `Grids with column lookups require lookup storage location to be specified using lookupStorage-bind property. Column: ${field}.`
         );

      let info = this.lookups[field];
      if (info) return;
      info = this.lookups[field] = {};
      info.idField = lookup.optionIdField || 'id';
      info.textField = lookup.optionTextField || 'text';
      info.options = lookup.options;
      let dataPath = `${this.storage.bind}.data.${field}`;
      if (isBinding(lookup.options)) dataPath = lookup.options.bind;
      info.dataPath = dataPath;
      if (isArray(info.options)) {
         this.store.set(info.dataPath, info.options);
      } else if (lookup.onQuery) {
         let statusPath = `${this.storage.bind}.status.${field}`;
         this.store.set(statusPath, 'loading');
         Promise.resolve(lookup.onQuery())
            .then((data) => {
               this.store.set(dataPath, data);
               this.store.set(statusPath, 'ok');
            })
            .catch((err) => {
               this.store.set(statusPath, 'error');
               console.error(`Failed to load lookup data for field ${field}.`, err);
            });
      }
   }

   getInfo(field) {
      let info = this.lookups[field];
      if (!info) throw new Error(`Lookup for field '${field}' is not registed.`);
      return info;
   }

   getValue(field, recordAlias) {
      let info = this.getInfo(field);
      let lastOptions = null,
         map = null;

      return computable(info.dataPath, `${recordAlias}.${field}`, (options, id) => {
         //fast path
         if (map && options === lastOptions) {
            if (isArray(id)) return id.map((id) => map[id]).join(', ');
            return map[id];
         }
         if (isArray(options)) {
            map = arrayToMap(
               options,
               (r) => r[info.idField],
               (r) => r[info.textField]
            );
            lastOptions = options;
            return map[id];
         }
         return null;
      });
   }

   getOptions(field) {
      let info = this.getInfo(field);
      return { bind: info.dataPath };
   }
}
