export function removeField(fieldName: string) {
   return (result) => {
      delete result[fieldName];
      return result;
   };
}
