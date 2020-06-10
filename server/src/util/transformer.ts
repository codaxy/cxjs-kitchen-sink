export function transform(data, ...transforms: ((r: any) => any)[]) {
   if (Array.isArray(data)) return data.map((r) => transform(r, ...transforms));
   if (typeof data == 'object') {
      let result = {
         ...data,
      };
      for (let transform of transforms) {
         result = transform(result);
      }
      return result;
   }
   return data;
}
