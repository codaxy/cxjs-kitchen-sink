import { Toolbar } from '../../../components/Toolbar';
import {
   Button,
   Menu,
   MenuItem,
   Grid,
   TextField,
   openContextMenu,
   Link,
   FieldGroup,
   TextArea,
   Checkbox,
} from 'cx/widgets';
import { KeySelection, History, LabelsLeftLayout } from 'cx/ui';
import '../../../util/formatting/relativetime';
import Controller from './Controller';
import { LoadingOverlay } from '../../../components/LoadingOverlay';
import { getSearchQueryPredicate } from 'cx/util';
import { SearchField } from '../../../components/SearchField';
import { AsyncButton } from '../../../components/AsyncButton';

const toolbarItems = (
   <cx>
      <MenuItem onClick="onAdd" autoClose icon="fa-plus">
         Add Role
      </MenuItem>
      <MenuItem
         autoClose
         disabled-expr="!{$page.selection}"
         onClick="onDelete"
         icon="fa-trash"
         confirm="Are you sure that you want to delete the selected user?"
      >
         Delete Role
      </MenuItem>
      <MenuItem
         autoClose
         disabled-expr="{$page.status} == 'loading'"
         onClick="onLoad"
         icon-expr="{$page.status} == 'loading' ? 'loading' : 'fa-sync-alt'"
      >
         Refresh
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
            <LoadingOverlay status-bind="$page.status" error-bind="$page.error" onRetry="onLoad" className="border-r">
               <Grid
                  scrollable
                  mod="fixed-layout"
                  sortField-bind="$page.sort.field"
                  sortDirection-bind="$page.sort.direction"
                  buffered
                  filterParams-bind="$page.filter.query"
                  onCreateFilter={(query) => {
                     let sp = getSearchQueryPredicate(query);
                     return (record) => sp(record.display_name) || sp(record.email);
                  }}
                  emptyText="There is no data matching the given search criteria."
                  columns={[
                     {
                        field: 'name',
                        header: 'Role',
                        sortable: true,
                        resizable: true,
                        defaultWidth: 300,
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
            </LoadingOverlay>
            <div class="flex-grow border-r px-4 py-2" style="max-width: 550px">
               <div class="flex border-b p-4">
                  <div>
                     <div class="">Role</div>
                     <p class="text-xs text-gray-600"></p>
                  </div>
                  <div class="ml-auto">
                     <FieldGroup invalid-bind="$page.invalid" visited-bind="$page.visited">
                        <LabelsLeftLayout>
                           <TextField
                              value-bind="$page.data.email"
                              label="Name"
                              required
                              autoFocus-expr="{$route.id} == 'new'"
                              class="w-64"
                           />
                           <TextArea value-bind="$page.data.description" label="Description" class="w-64" />
                        </LabelsLeftLayout>
                     </FieldGroup>
                  </div>
               </div>
               <div class="border-b p-4 flex">
                  <div>
                     <div class="">Permissions</div>
                     <p class="text-xs text-gray-600"></p>
                  </div>
                  <div class="ml-auto text-sm inline-block">
                     <div class="text-base mb-2">Administration</div>
                     <div class="flex items-center w-64">
                        View users
                        <Checkbox class="ml-auto" />
                     </div>
                     <div class="flex items-center w-64">
                        Create/edit user
                        <Checkbox class="ml-auto" />
                     </div>
                     <div class="flex items-center w-64">
                        Delete user
                        <Checkbox class="ml-auto" />
                     </div>
                     <div class="flex items-center w-64">
                        Reset password
                        <Checkbox class="ml-auto" />
                     </div>
                     <div class="flex items-center w-64">
                        Manage Roles
                        <Checkbox class="ml-auto" />
                     </div>
                  </div>
               </div>
               <div class="px-4 py-5 text-right">
                  <Button
                     onClick={() => {
                        History.pushState({}, null, '~/admin/users');
                     }}
                  >
                     Cancel
                  </Button>
                  <AsyncButton class="ml-2" mod="primary" onClick="onSave">
                     Save
                  </AsyncButton>
               </div>
            </div>
            <div class="flex-grow bg-gray-100" />
         </div>
      </div>
   </cx>
);
