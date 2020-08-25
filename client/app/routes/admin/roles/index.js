import { computable, KeySelection, LabelsLeftLayout } from 'cx/ui';
import {
   Button,
   Checkbox,
   FieldGroup,
   Grid,
   Menu,
   MenuItem,
   openContextMenu,
   PrivateStore,
   Repeater,
   TextArea,
   TextField,
} from 'cx/widgets';
import { AsyncButton } from '../../../components/AsyncButton';
import { LoadingMask } from '../../../components/LoadingMask';
import { SearchField } from '../../../components/SearchField';
import { Toolbar } from '../../../components/Toolbar';
import '../../../util/formatting/relativetime';
import Controller from './Controller';
import { Permission, permissionGroups } from './permissions';

const toolbarItems = (
   <cx>
      <MenuItem onClick="onAdd" autoClose icon="fa-plus">
         Add Role
      </MenuItem>
      <MenuItem
         autoClose
         disabled-expr="{$page.status} == 'loading'"
         onClick="onLoad"
         icon-expr="{$page.status} == 'loading' ? 'loading' : 'fa-sync-alt'"
      >
         Refresh
      </MenuItem>
      <MenuItem
         autoClose
         disabled-expr="!{$page.selection}"
         onClick="onDelete"
         icon="fa-trash"
         //confirm="Are you sure that you want to delete the selected role?"
      >
         Delete Role
      </MenuItem>
   </cx>
);

export default (
   <cx>
      <div class="flex flex-col flex-grow" controller={Controller}>
         <Toolbar>
            <SearchField value={{ bind: '$page.filter.query', debounce: 300 }} placeholder="Search roles..." />
            {toolbarItems}
         </Toolbar>
         <div class="flex-grow flex border-t">
            <LoadingMask
               status-bind="$page.status"
               error-bind="$page.error"
               onRetry="onLoad"
               className="border-r"
               style="width: 300px"
            >
               <Grid
                  scrollable
                  sortField-bind="$page.sort.field"
                  sortDirection-bind="$page.sort.direction"
                  filterParams-bind="$page.filter.query"
                  onCreateFilter={(query) => {
                     //let sp = getSearchQueryPredicate(query);
                     //return (record) => sp(record.name) || sp(record.description);
                     return (record) => !query || record.name?.indexOf(query) >= 0;
                  }}
                  emptyText="There is no data matching the given search criteria."
                  columns={[
                     {
                        field: 'name',
                        header: { text: 'Role', style: 'border-top: none; border-right: none' },
                        sortable: true,
                        items: (
                           <cx>
                              <div text-bind="$record.name" class="text-base font-bold" />
                              <div
                                 text-bind="$record.description"
                                 class="text-xs text-gray-600"
                                 visible-expr="!!{$record.description}"
                              />
                              <div
                                 text="No description"
                                 class="text-xs text-gray-500"
                                 visible-expr="!{$record.description}"
                              />
                           </cx>
                        ),
                     },
                  ]}
                  class="h-full"
                  border={false}
                  showBorder={false}
                  records-bind="$page.data"
                  keyField="id"
                  selection={{
                     bind: '$page.selection',
                     type: KeySelection,
                     keyField: 'id',
                  }}
                  onRowContextMenu={(e, instance) =>
                     openContextMenu(
                        e,
                        <cx>
                           <Menu>{toolbarItems}</Menu>
                        </cx>,
                        instance
                     )
                  }
                  onRowDoubleClick="onEdit"
               />
            </LoadingMask>
            <div class="flex-grow border-r px-4 py-2" style="max-width: 550px" visible-expr="!!{$page.editor.visible}">
               <PrivateStore data={{ data: { bind: '$page.editor.data' }, visible: { bind: '$page.editor.visible' } }}>
                  <div class="flex border-b p-4">
                     <div>
                        <div class="">Rolle</div>
                        <p class="text-xs text-gray-600"></p>
                     </div>
                     <div class="ml-auto">
                        <FieldGroup invalid-bind="invalid" visited-bind="visited">
                           <LabelsLeftLayout>
                              <TextField
                                 value-bind="data.name"
                                 label="Name"
                                 required
                                 autoFocus-expr="!{data.id}"
                                 class="w-64"
                              />
                              <TextArea value-bind="data.description" label="Desciption" class="w-64" />
                           </LabelsLeftLayout>
                        </FieldGroup>
                     </div>
                  </div>
                  <div class="border-b p-4 flex">
                     <div>
                        <div class="">permissions</div>
                        <p class="text-xs text-gray-600"></p>
                     </div>
                     <div class="ml-auto text-sm inline-block">
                        <Repeater records={getPermissionGroups()} recordAlias="$pg">
                           <div class="text-base mb-2" text-bind="$pg.name" />
                           <Repeater records-bind="$pg.permissions">
                              <div class="flex items-center w-64">
                                 <span text-bind="$record.description" />
                                 <Checkbox
                                    class="ml-auto"
                                    value={{
                                       get: computable('data.permissions', '$record.code', (p, code) =>
                                          p.includes(code)
                                       ),
                                       set: (value, { store }) => {
                                          let code = store.get('$record.code');
                                          store.update('data.permissions', (p) => p.filter((x) => x != code));
                                          if (value) store.update('data.permissions', (p) => [...p, code]);
                                       },
                                    }}
                                 />
                              </div>
                           </Repeater>
                        </Repeater>
                     </div>
                  </div>
                  <div class="px-4 py-5 text-right">
                     <Button
                        onClick={(e, { store }) => {
                           store.set('visible', false);
                        }}
                     >
                        Cancel
                     </Button>
                     <AsyncButton class="ml-2" mod="primary" onClick="onSave">
                        Save
                     </AsyncButton>
                  </div>
               </PrivateStore>
            </div>
            <div class="flex-grow bg-gray-100" />
         </div>
      </div>
   </cx>
);

export function getPermissionGroups() {
   let groups = [];
   for (let module in permissionGroups) {
      let permissions = [];
      for (let resource in Permission[module]) {
         for (let perm in Permission[module][resource]) permissions.push(Permission[module][resource][perm]);
      }
      groups.push({ name: permissionGroups[module], permissions });
   }
   return groups;
}
