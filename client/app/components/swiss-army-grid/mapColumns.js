import { flattenColumnConfig } from './flattenColumnConfig';
import { isObject } from 'cx/util';
import { getColumnHeaderText } from './getComplexColumnHeaderText';

function extractHeaders(col) {
   let result = [];
   let at = col.header;
   while (at != null) {
      result.push(at);
      at = at.parent;
   }
   return result.reverse();
}

export function mapColumns(list, config, process) {
   config = flattenColumnConfig(config, (c) => {
      c.text = getColumnHeaderText(c);
      if (process) return process(c);
      return c;
   });

   let headerDepth = 0;

   list.forEach((field) => {
      let c = config[field];
      if (c && c.header.level > headerDepth) headerDepth = c.header.level;
   });

   let lastHeaders = [];
   let result = [];

   list.forEach((field) => {
      let c = config[field];
      if (!c) return;

      let headers = extractHeaders(c);
      delete c.header;

      let depth = 0;

      for (let i = 0; i < headers.length; i++) {
         let h = headers[i];
         if (h == lastHeaders[i]) {
            h.colSpan = (h.colSpan || 1) + 1;
         } else {
            c[`header${i + 1}`] = h;
         }
         depth += h.rowSpan || 1;

         if (i + 1 == headers.length) {
            if (depth < headerDepth) h.rowSpan = (h.rowSpan || 1) + headerDepth - depth;

            if (c.defaultWidth) {
               h.defaultWidth = c.defaultWidth;
               delete c.defaultWidth;
            }
         }
      }

      lastHeaders = headers;

      result.push(c);
   });

   return result;
}
