import { isBinding, updateArray } from 'cx/data';
import { Container, DataProxy, Format, getContent, VDOM, Widget } from 'cx/ui';
import {
   closest,
   closestParent,
   findFirstChild,
   isFocusable,
   isFunction,
   isString,
   KeyCode,
   stopPropagation,
} from 'cx/util';
import { Button, FlexRow, getCursorPos, ValidationGroup } from 'cx/widgets';

let scrollResetParam = 0;

export function createRowEditorRecord(data) {
   return {
      ...data,
      $editor: {
         add: true,
         invalid: true,
         scrollReset: ++scrollResetParam,
         record: data,
      },
   };
}

export function createRowEditor({
   columns,
   records,
   deleteDisabled,
   recordAlias,
   confirmDeleteMessage,
   onSaveRecord,
   onDeleteRecord,
   isRecordEditable,
   onRowClick,
}) {
   if (!recordAlias) recordAlias = '$record';
   let editorPath = `${recordAlias}.$editor`;

   function saveRow(e, instance) {
      let { store } = instance;
      let { record, invalid, add } = store.get(editorPath);
      if (invalid) return;
      store.set(recordAlias, record);
      let info = { add };
      if (isString(onSaveRecord)) instance.invokeControllerMethod(onSaveRecord, record, instance, info);
      else if (isFunction(onSaveRecord)) onSaveRecord(record, instance, info);
      revertFocusToGrid(e);
   }

   function editRow(e, instance) {
      let { store } = instance;
      let record = store.get(recordAlias);
      if (isFunction(isRecordEditable) && !isRecordEditable(record)) return;
      if (record.$editor) return;
      if (isBinding(records)) {
         store.update(
            records.bind,
            updateArray,
            (a) => ({ ...a, $editor: null }),
            (a) => !!a.$editor,
            (a) => a.add
         );
      }

      store.set(editorPath, {
         record,
         invalid: false,
      });
   }

   function deleteRow(e, instance) {
      let { store, controller } = instance;
      let data = store.get(recordAlias);
      if (isString(onDeleteRecord)) controller[onDeleteRecord](data, instance);
      else onDeleteRecord(data, instance);
   }

   function cancelRowEdit(e, { store }) {
      let { add } = store.get(editorPath);
      e.stopPropagation();
      if (add) store.delete(recordAlias);
      else store.delete(editorPath);
   }

   let columnEditors = columns.map((column) => getColumnContent(column, recordAlias));

   return {
      onRowKeyDown: (e, instance) => {
         let { store } = instance;
         let editor = store.get('$record.$editor');
         if (e.keyCode == KeyCode.esc && editor) {
            cancelRowEdit(e, instance);
            return false;
         }

         if (e.keyCode != KeyCode.enter) return;

         //ignore enter in TextArea
         if (e.target.nodeName == 'TEXTAREA') {
            e.stopPropagation();
            return false;
         }

         //save
         if (editor) {
            saveRow(e, instance);
            e.stopPropagation();
            return false;
         } else {
            let nowEditing = isBinding(records) && store.get(records.bind).some((r) => r.$editor);
            if (instance.selected || nowEditing) {
               editRow(e, instance);
               e.stopPropagation();
               return false;
            }
         }
      },
      onRowClick: (e, instance) => {
         let { store } = instance;
         if (isBinding(records)) {
            let recordList = store.get(records.bind);
            let record = store.get(recordAlias);
            if (recordList.some((r) => r.$editor && r != record)) editRow(e, instance);
         }

         if (onRowClick) {
            if (isString(onRowClick)) {
               let { controller } = instance;
               controller[onRowClick](e, instance);
            } else onRowClick(e, instance);
         }
      },
      onRowDoubleClick: (e, instance) => {
         reportRowEditingDoubleClickLocation(e);
         editRow(e, instance);
      },
      buttons: (
         <cx>
            <FlexRow justify={!!onDeleteRecord ? 'center' : 'start'} class="text-gray-600 opacity-50">
               <Button
                  mod="hollow"
                  onClick={editRow}
                  icon="fa-edit"
                  tooltip="Edit"
                  onMouseDown={stopPropagation}
                  class="hover:text-black"
               />

               <Button
                  mod="hollow"
                  onClick={deleteRow}
                  disabled={deleteDisabled}
                  visible={!!onDeleteRecord}
                  onMouseDown={stopPropagation}
                  confirm={
                     confirmDeleteMessage || {
                        message: 'Are you sure that you want to delete the selected record?',
                        yesText: 'Delete',
                        noText: 'Cancel',
                     }
                  }
                  icon="fa-trash"
                  tooltip="Delete"
                  class="hover:text-black"
               />
            </FlexRow>
            <ValidationGroup visible-expr={`!!{${recordAlias}.$editor}`} invalid-bind={`${editorPath}.invalid`}>
               <RowEditor
                  autoFocusFirstField
                  buttons={
                     <cx>
                        <Button onClick={cancelRowEdit} text="Cancel" class="mr-1" />
                        <Button onClick={saveRow} disabled-bind={`${editorPath}.invalid`} text="Save" />
                     </cx>
                  }
               >
                  <DataProxy
                     immutable
                     data={{
                        [recordAlias]: {
                           expr: `{${recordAlias}.$editor.record}`,
                           set: (value, { store }) => {
                              store.store.set(`${recordAlias}.$editor.record`, value);
                           },
                        },
                        $oldValues: {
                           bind: recordAlias,
                        },
                     }}
                  >
                     {columnEditors}
                  </DataProxy>
               </RowEditor>
            </ValidationGroup>
         </cx>
      ),
   };
}

export class RowEditor extends Container {
   declareData(...args) {
      return super.declareData(...args, { autoFocusFirstField: undefined, scrollReset: undefined });
   }

   render(context, instance, key) {
      let buttons = getContent(instance.components.buttons.render(context));
      return (
         <RowEditorCmp key={key} data={instance.data} buttons={buttons}>
            {this.renderChildren(context, instance)}
         </RowEditorCmp>
      );
   }

   initComponents(...args) {
      return super.initComponents(...args, {
         buttons: Container.create({ children: this.buttons }),
      });
   }
}

RowEditor.prototype.styled = true;
RowEditor.prototype.baseClass = 'roweditor';
RowEditor.prototype.autoFocusFirstField = false;

let lastDoubleClickPos = null;

export function reportRowEditingDoubleClickLocation(e) {
   lastDoubleClickPos = getCursorPos(e);
   setTimeout(() => {
      lastDoubleClickPos = null;
   }, 100);
}

class RowEditorCmp extends VDOM.Component {
   render() {
      let { data, children, buttons } = this.props;

      return (
         <div
            className={data.classNames}
            ref={(el) => {
               this.el = el;
            }}
            onContextMenu={(e) => {
               e.stopPropagation();
               e.preventDefault();
            }}
            onMouseDown={stopPropagation}
         >
            {children}
            <div
               className="cxe-roweditor-floater"
               ref={(el) => {
                  this.floaterEl = el;
               }}
            >
               {buttons}
            </div>
         </div>
      );
   }

   componentDidMount() {
      let { data } = this.props;
      this.scroller = closest(this.el, (parent) => parent.classList.contains('cxe-grid-scroll-area'));
      this.reposition = this.reposition.bind(this);
      this.scroller.addEventListener('scroll', this.reposition);
      this.reposition();
      if (data.autoFocusFirstField) {
         let rowEl = this.el;
         if (rowEl && !rowEl.contains(document.activeElement)) {
            let focusableChild = null,
               minDist = Infinity;
            if (lastDoubleClickPos) {
               let el = document.elementFromPoint(lastDoubleClickPos.clientX, lastDoubleClickPos.clientY);
               if (isFocusable(el)) focusableChild = el;
               else {
                  //calculate distance to each focusable element and pick the closest one
                  findFirstChild(rowEl, (el) => {
                     if (!isFocusable(el)) return;
                     if (this.floaterEl.contains(el)) return;
                     let bounds = el.getBoundingClientRect();
                     let dist = Math.min(
                        Math.max(0, Math.abs(bounds.left - lastDoubleClickPos.clientX)),
                        Math.max(0, Math.abs(lastDoubleClickPos.clientX - bounds.right))
                     );
                     if (dist < minDist && dist <= 150) {
                        focusableChild = el;
                        minDist = dist;
                     }
                  });
               }
            } else if (!focusableChild) {
               //focus the first focusable element if there are no better candidates
               focusableChild = findFirstChild(rowEl, isFocusable);
            }

            if (focusableChild) {
               setTimeout(() => {
                  focusableChild.focus();
               }, 0);
            }
         }
      }
   }

   reposition() {
      let eb = this.el.parentElement.getBoundingClientRect();
      let sb = this.scroller.getBoundingClientRect();

      let width = this.el.parentElement.parentElement.offsetWidth;

      this.el.style.width = `${width}px`;
      let visibleWidth = Math.min(width, sb.width);

      this.floaterEl.style.left = `${visibleWidth / 2 - this.floaterEl.offsetWidth / 2 + this.scroller.scrollLeft}px`;

      if (eb.bottom > sb.bottom - 50) this.floaterEl.classList.add('cxs-place-up');
      else this.floaterEl.classList.remove('cxs-place-up');

      let l = Math.min(this.el.children.length - 1, this.el.parentElement.parentElement.children.length);

      //TODO: introduce resize observer to monitor for column resizing
      for (let i = 0; i < l; i++) {
         this.el.children[i].style.width = `${this.el.parentElement.parentElement.children[i].offsetWidth}px`;
      }
   }

   componentWillUnmount() {
      this.scroller.removeEventListener('scroll', this.reposition);
   }
}

function getColumnContent(column, recordAlias) {
   let content = null;
   let style = {};
   let className = {
      'cxe-roweditor-editor-wrapper': true,
   };
   if (column.align) style.textAlign = column.align;

   if (column.editor) content = column.editor;
   else {
      className['cxs-no-editor'] = true;
      if (column.items) content = column.items;
      else if (column.children) content = column.children;
      else {
         let value = column.value || { bind: `${recordAlias}.${column.field}` };
         content = (
            <cx>
               <Value value={value} format={column.format || 's'} />
            </cx>
         );
      }
   }

   return (
      <cx>
         <div class={className} visible={column.visible != null ? column.visible : true} style={style}>
            {content}
         </div>
      </cx>
   );
}

export class Value extends Widget {
   declareData() {
      super.declareData(
         {
            value: undefined,
            format: undefined,
         },
         ...arguments
      );
   }

   render(context, { data }, key) {
      if (data.value == null) return '';
      return data.format ? Format.value(data.value, data.format) : data.value;
   }
}

const revertFocusToGrid = (e) => {
   let focusableParent = closestParent(e.target, isFocusable);
   if (focusableParent)
      setTimeout(() => {
         focusableParent.focus();
      }, 0);
};
