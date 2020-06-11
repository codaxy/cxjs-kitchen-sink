type Transform = (r: any) => any;

export class DataTransformer {
   transforms: Transform[] = [];

   transform(data) {
      if (Array.isArray(data)) return data.map((r) => this.transform(r));
      if (typeof data == 'object') {
         let result = {
            ...data,
         };
         for (let t of this.transforms) {
            result = t(result);
         }
         return result;
      }
      return data;
   }

   renameField(oldFieldName: string, newFieldName: string, dataTransformer: DataTransformer = null) {
      this.transforms.push((record) => {
         record[newFieldName] = record[oldFieldName];
         if (dataTransformer) record[newFieldName] = dataTransformer.transform(record[newFieldName]);
         delete record[oldFieldName];
         return record;
      });
      return this;
   }

   removeField(fieldName: string) {
      this.transforms.push((record) => {
         delete record[fieldName];
         return record;
      });
      return this;
   }

   add(transform: Transform) {
      this.transforms.push(transform);
      return this;
   }
}
