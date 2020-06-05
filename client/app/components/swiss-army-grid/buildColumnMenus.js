import { isString, isObject, stopPropagation, isArray, isNonEmptyArray, sameDate, zeroTime } from 'cx/util';
import { TextField, NumberField, DateField, Menu, Submenu, Icon, MenuItem } from 'cx/widgets';
import { getSearchQueryPredicate, Format } from 'cx/util';
import { computable } from 'cx/ui';
import { isNonEmptyObjectDeep } from '../../util/isNonEmptyObjectDeep';
import { getClassNameObject } from '../../util/getClassNameObject';

const defaultDebounceTimeout = 400;

function getTextFilter(field, filterPath, format) {
   return {
      predicate: (filterParams) => {
         let filter = filterParams[field];
         if (!filter || filter.value == null) return null;
         let search = getSearchQueryPredicate(filter.value);
         let formatter = Format.parse(format || 's');
         return (record) => record[field] != null && search(formatter(record[field]));
      },
      menu: (
         <cx>
            <TextField
               placeholder="Search..."
               reactOn="change enter blur"
               value={{ bind: filterPath + '.value', debounce: defaultDebounceTimeout }}
               showClear
               inputAttrs={{ autoComplete: 'off' }}
               reactOn="change enter blur"
            />
         </cx>
      ),
   };
}

function getLookupFilter(field, filterPath, lookupOptionsCache) {
   return {
      predicate: (filterParams, { store }) => {
         let filter = filterParams[field];
         if (!filter || filter.value == null) return null;
         let search = getSearchQueryPredicate(filter.value);
         let { dataPath, textField, idField } = lookupOptionsCache.getInfo(field);
         let options = store.get(dataPath);
         if (isNonEmptyArray(options)) {
            let positives = {};
            options.forEach((option) => {
               let text = option[textField];
               if (text && search(text)) positives[option[idField]] = true;
            });
            return (record) => positives[record[field]];
         }
         return (record) => record[field] != null && search(formatter(record[field]));
      },
      menu: (
         <cx>
            <TextField
               placeholder="Search..."
               value={{ bind: filterPath + '.value', debounce: defaultDebounceTimeout }}
               showClear
               inputAttrs={{ autoComplete: 'off' }}
               reactOn="change enter blur"
            />
         </cx>
      ),
   };
}

function getBooleanFilter(field, filterPath) {
   return {
      predicate: (filterParams) => {
         let filter = filterParams[field];
         if (filter == null) return null;
         if (filter == 'truthy') return (record) => !!record[field];
         if (filter == 'falsey') return (record) => !record[field];
         return null;
      },
      menu: (
         <cx>
            <MenuItem
               checked={{
                  get: computable(filterPath, (value) => value == 'truthy'),
                  set: (value, { store }) => {
                     if (value) store.set(filterPath, 'truthy');
                     else store.delete(filterPath);
                  },
               }}
            >
               True
            </MenuItem>
            <MenuItem
               checked={{
                  get: computable(filterPath, (value) => value == 'falsey'),
                  set: (value, { store }) => {
                     if (value) store.set(filterPath, 'falsey');
                     else store.delete(filterPath);
                  },
               }}
            >
               False
            </MenuItem>
         </cx>
      ),
   };
}

function getNumberFilter(field, filterPath, format, scale) {
   let exactPath = filterPath + '.exact';
   let rangePath = filterPath + '.range';

   return {
      predicate: (filterParams) => {
         let filter = filterParams[field];
         if (!filter) return null;
         let filters = [];
         if (filter.exact != null) filters.push((record) => record[field] == filter.exact);
         if (filter.range && filter.range.from != null) filters.push((record) => record[field] >= filter.range.from);
         if (filter.range && filter.range.to != null) filters.push((record) => record[field] <= filter.range.to);
         return filters;
      },
      menu: (
         <cx>
            <Submenu
               text="Exact"
               arrow
               checked={{
                  get: computable(exactPath, isNonEmptyObjectDeep),
                  set: (value, { store }) => {
                     if (!value) store.delete(exactPath);
                  },
               }}
            >
               <Menu putInto="dropdown">
                  <NumberField
                     placeholder="Value..."
                     value={{ bind: exactPath, debounce: defaultDebounceTimeout }}
                     showClear
                     format={format}
                     scale={scale || 1}
                     reactOn="change enter blur"
                  />
               </Menu>
            </Submenu>
            <Submenu
               text="Range"
               arrow
               checked={{
                  get: computable(rangePath, isNonEmptyObjectDeep),
                  set: (value, { store }) => {
                     if (!value) store.delete(rangePath);
                  },
               }}
            >
               <Menu putInto="dropdown">
                  <NumberField
                     placeholder="From..."
                     value={{ bind: rangePath + '.from', debounce: defaultDebounceTimeout }}
                     showClear
                     format={format}
                     scale={scale || 1}
                     label="From"
                  />
                  <NumberField
                     placeholder="To..."
                     value={{ bind: rangePath + '.to', debounce: defaultDebounceTimeout }}
                     showClear
                     format={format}
                     scale={scale || 1}
                     label="To"
                  />
               </Menu>
            </Submenu>
         </cx>
      ),
   };
}

function getDateFilter(field, filterPath, format) {
   let exactPath = filterPath + '.exact';
   let rangePath = filterPath + '.range';

   return {
      predicate: (filterParams) => {
         let filter = filterParams[field];
         if (!filter) return null;
         let filters = [];
         if (filter.exact != null) {
            let v = new Date(filter.exact).valueOf();
            filters.push((record) => zeroTime(new Date(record[field])).valueOf() == v);
         }
         if (filter.range && filter.range.from != null) {
            let v = new Date(filter.range.from).valueOf();
            filters.push((record) => zeroTime(new Date(record[field])).valueOf() >= v);
         }
         if (filter.range && filter.range.to != null) {
            let v = new Date(filter.range.to).valueOf();
            filters.push((record) => zeroTime(new Date(record[field])).valueOf() <= v);
         }
         return filters;
      },
      menu: (
         <cx>
            <Submenu
               text="Exact"
               arrow
               checked={{
                  get: computable(exactPath, isNonEmptyObjectDeep),
                  set: (value, { store }) => {
                     if (!value) store.delete(exactPath);
                  },
               }}
            >
               <Menu putInto="dropdown">
                  <DateField placeholder="Date..." value-bind={exactPath} showClear />
               </Menu>
            </Submenu>
            <Submenu
               text="Range"
               arrow
               checked={{
                  get: computable(rangePath, isNonEmptyObjectDeep),
                  set: (value, { store }) => {
                     if (!value) store.delete(rangePath);
                  },
               }}
            >
               <Menu putInto="dropdown">
                  <DateField
                     placeholder="From..."
                     value-bind={rangePath + '.from'}
                     showClear
                     class="margin-bottom"
                     label="From"
                  />
                  <DateField placeholder="To..." value-bind={rangePath + '.to'} showClear label="To" />
               </Menu>
            </Submenu>
         </cx>
      ),
   };
}

function buildColumnMenu(column, state, options) {
   let result = { ...column };

   if (isString(result.header))
      result.header = {
         text: result.header,
      };

   let header = result.header3 || result.header2 || result.header1 || result.header;
   if (!isObject(header) || column.filterable === false) return column;

   let filterPath = `${options.filterPath}.${column.field}`;

   state.filterParams[column.field] = { bind: filterPath };

   let filter;
   if (column.type == 'date' || column.type == 'datetime')
      filter = getDateFilter(column.field, filterPath, column.format);
   else if (column.type == 'number') filter = getNumberFilter(column.field, filterPath, column.format);
   else if (column.type == 'percentage') filter = getNumberFilter(column.field, filterPath, column.format || 'p', 0.01);
   else if (column.type == 'boolean') filter = getBooleanFilter(column.field, filterPath);
   else if (column.type == 'lookup') filter = getLookupFilter(column.field, filterPath, options.lookupOptionsCache);
   else filter = getTextFilter(column.field, filterPath, column.format);

   let { menu, predicate } = filter;

   state.filters.push(predicate);

   header.className = getClassNameObject(header.className);

   header.className['cxs-filtered'] = computable(filterPath, isNonEmptyObjectDeep);

   header.tool = (
      <cx>
         <div onKeyDown={stopPropagation}>
            <Menu horizontal itemPadding="small">
               <Submenu placement="down-left">
                  <span class="cxe-grid-col-header-filter">
                     <Icon name="fa-filter" />
                  </span>
                  <Menu putInto="dropdown">
                     <Submenu
                        text="Filter"
                        checked={{
                           get: computable(filterPath, isNonEmptyObjectDeep),
                           set: (value, { store }) => {
                              if (!value) store.delete(filterPath);
                           },
                        }}
                        arrow
                     >
                        <Menu putInto="dropdown">{menu}</Menu>
                     </Submenu>
                  </Menu>
               </Submenu>
            </Menu>
         </div>
      </cx>
   );

   return result;
}

export function buildColumnMenus(columns, options) {
   let filters = [],
      filterParams = {};

   columns = columns.map((column) => buildColumnMenu(column, { filterParams, filters }, options));

   return {
      columns,
      filterParams,
      onCreateFilter: (filterParams, instance) => {
         let conditions = filters.flatMap((f) => f(filterParams, instance)).filter((f) => !!f);
         if (conditions.length == 0) return null;
         return (record) => conditions.every((c) => c(record));
      },
   };
}
