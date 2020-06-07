import { isBinding } from 'cx/data';
import { computable, ContentResolver, createFunctionalComponent } from 'cx/ui';
import { isObject, isString, isFunction } from 'cx/util';
import { Grid, NumberField, DateField, Checkbox, TextField, LookupField } from 'cx/widgets';
import { getClassNameObject } from '../../util/getClassNameObject';
import { isNonEmptyObjectDeep } from '../../util/isNonEmptyObjectDeep';
import { buildColumnMenus } from './buildColumnMenus';
import { createRowEditor } from './RowEditor';
import { mapColumns } from './mapColumns';
import { LookupOptionsCache } from './LookupOptionsCache';
import { LoadingSignal } from '../LoadingMask';

const defaultColumnOptions = {
   resizable: false,
   sortable: false,
   headerClass: null,
   editorMod: null,
};

export const SwissArmyGrid = createFunctionalComponent(
   ({
      print,
      columns,
      scrollable,
      buffered,
      style,
      onGetColumns,
      onGetColumnsConfig,
      columnOptions,
      columnWidths,
      records,
      filter,
      className,
      rowEditable,
      onSaveRecord,
      onDeleteRecord,
      isRecordEditable,
      recordAlias,
      loadingMod,
      lookupStorage,
      params,
      ...props
   }) => {
      recordAlias = recordAlias || '$record';
      let lookupsLoading =
         isBinding(lookupStorage) &&
         computable(`${lookupStorage.bind}.status`, (data) => {
            if (!isObject(data)) return false;
            for (let field in data) {
               if (data[field] == 'loading') return true;
            }
            return false;
         });

      return (
         <cx>
            <LoadingSignal loading={lookupsLoading} />
            <ContentResolver
               params={{ columnsList: columns, print, ...params }}
               onResolve={({ columnsList, print, ...params }, { store }) => {
                  let lookupOptionsCache = new LookupOptionsCache({ store, recordAlias, storage: lookupStorage });
                  let columns = columnsList;
                  let options = { ...defaultColumnOptions, ...columnOptions };
                  let processColumn = (col) => {
                     let result = { ...col };
                     if (!isObject(result.header)) result.header = { text: result.header };
                     if (isBinding(columnWidths))
                        result.header.width = { bind: `${columnWidths.bind}.${result.field}` };
                     if (options.resizable && result.header.resizable == null) result.header.resizable = true;
                     if (options.sortable && result.sortable == null) result.sortable = true;
                     if (options.headerClass) result.header.class = options.headerClass;
                     if (options.defaultWidth && !result.defaultWidth) result.defaultWidth = options.defaultWidth;

                     resolveColumnTypeAndEditor(result, {
                        recordAlias,
                        print,
                        lookupOptionsCache,
                        rowEditable,
                        onSaveRecord,
                        editorMod: options.editorMod,
                        cellEditable: props.cellEditable,
                     });
                     return result;
                  };

                  if (onGetColumns) columns = onGetColumns(columns, { print, params }).map(processColumn);
                  else if (onGetColumnsConfig) {
                     let config = onGetColumnsConfig({ print, params });
                     columns = mapColumns(columns, config, processColumn);
                  } else columns = columns.map(processColumn);

                  if (isBinding(filter)) {
                     let filterProps = buildColumnMenus(columns, {
                        filterPath: filter.bind,
                        lookupOptionsCache,
                     });
                     columns = filterProps.columns;
                     props.onCreateFilter = filterProps.onCreateFilter;
                     props.filterParams = filterProps.filterParams;
                     className = getClassNameObject(className);
                     className['cxs-filtered'] = computable(filter.bind, isNonEmptyObjectDeep);
                  }

                  if (rowEditable && !print) {
                     let { onRowKeyDown, onRowDoubleClick, onRowClick, buttons } = createRowEditor({
                        columns,
                        records,
                        onSaveRecord,
                        onDeleteRecord,
                        isRecordEditable,
                        onRowClick: props.onRowClick,
                     });
                     columns = [
                        ...columns,
                        {
                           header: {
                              style: 'width: 10px;',
                           },
                           style: 'width: 10px; overflow: visible; position: relative',
                           items: buttons,
                        },
                     ];

                     props.onRowClick = onRowClick;
                     props.onRowDoubleClick = onRowDoubleClick;
                     props.onRowKeyDown = onRowKeyDown;
                  }

                  return (
                     <cx>
                        <Grid
                           records={records}
                           style={!print ? style : null}
                           className={className}
                           class={rowEditable ? 'row-editable' : ''}
                           scrollable={print ? false : scrollable}
                           buffered={print ? false : buffered}
                           columns={columns}
                           preSorters={
                              rowEditable && [{ direction: 'ASC', value: { expr: '{$record.$editor.add} ? 0 : 1' } }]
                           }
                           scrollResetParams={
                              rowEditable && isBinding(records) && { expr: `{${records.bind}.0.$editor.scrollReset}` }
                           }
                           {...props}
                        />
                     </cx>
                  );
               }}
            />
         </cx>
      );
   }
);

function resolveColumnTypeAndEditor(column, options) {
   let { format, type, field, required } = column;
   let { recordAlias, lookupOptionsCache, print, rowEditable, onSaveRecord, editorMod, cellEditable } = options;
   if (!type) {
      if (column.lookup) type = 'lookup';
      else if (isString(format)) {
         if (format == 'n' || format.startsWith('n;')) type = 'number';
         else if (format == 'number' || format.startsWith('number;')) type = 'number';
         if (format == 'p' || format.startsWith('p;')) type = 'percentage';
         else if (format == 'd' || format.startsWith('d;')) type = 'date';
         else if (format == 'date' || format.startsWith('date;')) type = 'date';
         else if (format == 'dt' || format.startsWith('dt;')) type = 'datetime';
         else if (format == 'datetime' || format.startsWith('datetime;')) type = 'datetime';
      }
   }

   type = column.type = type || 'text';

   let valuePath = `${recordAlias}.${field}`;

   if (type == 'boolean' && !column.children && !column.items) {
      if (!column.align) column.align = 'center';
      column.items = (
         <cx>
            <Checkbox
               value={{
                  expr: `!!{${valuePath}}`,
                  set: (value, instance) => {
                     let { store } = instance;
                     store.set(valuePath, value);
                     let record = store.get(recordAlias);
                     if (isString(onSaveRecord)) instance.invokeControllerMethod(onSaveRecord, record, instance);
                     else if (isFunction(onSaveRecord)) onSaveRecord(required, instance);
                  },
               }}
               readOnly={!rowEditable || !column.editor}
               mod={editorMod}
            />
         </cx>
      );
   }

   if (type == 'lookup') {
      if (!column.lookup) throw new Error(`Lookup column ${field} doesn't have lookup data defined.`);
      lookupOptionsCache.register(column.field, column.lookup);
      if (!column.children && !column.items && !column.value)
         column.value = options.lookupOptionsCache.getValue(field, recordAlias);
   }

   if (print) {
      delete column.editor;
   } else {
      if (column.editor === true) {
         switch (type) {
            default:
            case 'text':
               column.editor = (
                  <cx>
                     <TextField
                        value-bind={valuePath}
                        style="width: 100%"
                        required={required}
                        mod={editorMod}
                        inputAttrs={{ autoComplete: 'off' }}
                     />
                  </cx>
               );
               break;
            case 'number':
               column.editor = (
                  <cx>
                     <NumberField
                        style="width: 100%"
                        value-bind={valuePath}
                        format={format}
                        required={required}
                        inputStyle={column.align == 'right' ? 'text-align: right' : null}
                        mod={editorMod}
                     />
                  </cx>
               );
               break;
            case 'percentage':
               column.editor = (
                  <cx>
                     <NumberField
                        style="width: 100%"
                        value-bind={valuePath}
                        format={format}
                        required={required}
                        scale={0.01}
                        inputStyle={column.align == 'right' ? 'text-align: right' : null}
                        mod={editorMod}
                     />
                  </cx>
               );
               break;
            case 'date':
               column.editor = (
                  <cx>
                     <DateField value-bind={valuePath} style="width: 100%" required={required} mod={editorMod} />
                  </cx>
               );
               break;
            case 'boolean':
               column.editor = (
                  <cx>
                     <Checkbox value-bind={valuePath} mod={editorMod} />
                  </cx>
               );
               break;
            case 'lookup':
               if (!column.lookup.multiple) {
                  column.editor = (
                     <cx>
                        <LookupField
                           value-bind={valuePath}
                           options={lookupOptionsCache.getOptions(field)}
                           optionIdField={column.lookup.optionIdField || 'id'}
                           optionTextField={column.lookup.optionTextField || 'text'}
                           style="width: 100%"
                           required={required}
                           mod={editorMod}
                           submitOnEnterKey={cellEditable}
                           autoOpen={cellEditable}
                        />
                     </cx>
                  );
               } else {
                  column.editor = (
                     <cx>
                        <LookupField
                           values-bind={valuePath}
                           options={lookupOptionsCache.getOptions(field)}
                           optionIdField={column.lookup.optionIdField || 'id'}
                           optionTextField={column.lookup.optionTextField || 'text'}
                           style="width: 100%"
                           required={required}
                           mod={editorMod}
                           multiple
                           submitOnEnterKey={cellEditable}
                           autoOpen={cellEditable}
                        />
                     </cx>
                  );
               }
               break;
         }
      }
   }
}
