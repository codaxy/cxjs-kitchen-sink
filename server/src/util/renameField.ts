export function renameField(oldFieldName: string, newFieldName: string) {
   return (result) => {
      result[newFieldName] = result[oldFieldName];
      delete result[oldFieldName];
      return result;
   };
}
