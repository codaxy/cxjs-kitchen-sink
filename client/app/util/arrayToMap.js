export function arrayToMap(array, keySelector, valueSelector) {
   let result = {};
   array.forEach((record) => {
      result[keySelector(record)] = valueSelector(record);
   });
   return result;
}
