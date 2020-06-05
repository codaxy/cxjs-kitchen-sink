import { isString, isObject } from 'cx/util';

export function getColumnHeaderText(column) {
   if (isString(column.header)) return column.header;
   if (isObject(column.header) && column.header.text != null) return column.header.text;
   return column.field;
}

export function getComplexColumnHeaderText(column) {
   let text = getColumnHeaderText(column);
   let header = column.header;
   while (header && header.parent) {
      if (header.parent.text) text = header.parent.text + ' - ' + text;
      header = header.parent;
   }
   return text;
}
