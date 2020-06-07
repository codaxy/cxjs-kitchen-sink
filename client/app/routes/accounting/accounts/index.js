import { KeySelection, LabelsLeftLayout } from 'cx/ui';
import {
   Button,
   FieldGroup,
   Grid,
   Menu,
   MenuItem,
   openContextMenu,
   PrivateStore,
   TextArea,
   TextField,
} from 'cx/widgets';
import { AsyncButton } from '../../../components/AsyncButton';
import { LoadingMask } from '../../../components/LoadingMask';
import { createRowEditorRecord } from '../../../components/swiss-army-grid/RowEditor';
import { SwissArmyGrid } from '../../../components/swiss-army-grid/SwissArmyGrid';
import { Toolbar } from '../../../components/Toolbar';
import '../../../util/formatting/relativetime';
import Controller from './Controller';

const toolbarItems = (
   <cx>
      <MenuItem onClick="onAdd" autoClose icon="fa-plus">
         Add Ledger
      </MenuItem>
      <MenuItem
         autoClose
         disabled-expr="!{$page.selection}"
         onClick="onDelete"
         icon="fa-trash"
         confirm="Are you sure that you want to delete the selected ledger?"
      >
         Delete Ledger
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
         <Toolbar>{toolbarItems}</Toolbar>
         <div class="flex-grow flex border-t">
            <LoadingMask
               status-bind="$page.status"
               errorMessage-bind="$page.error"
               onRetry="onLoad"
               className="border-r"
               style="width: 350px"
            >
               <Grid
                  scrollable
                  sortField-bind="$page.sort.field"
                  sortDirection-bind="$page.sort.direction"
                  emptyText="No data."
                  columns={[
                     {
                        field: 'name',
                        header: { text: 'Ledger', style: 'border-top: none;' },
                        sortable: true,
                        items: (
                           <cx>
                              <div text-bind="$record.name" class="text-base font-bold mb-1" />
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
                     {
                        field: 'year',
                        header: { text: 'Year', style: 'border-top: none; border-right: none' },
                        align: 'center',
                        sortable: true,
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
                  defaultSortField="year"
                  defaultSortDirection="DESC"
               />
            </LoadingMask>
            <div
               class="flex-grow-100 border-r px-4 py-2 flex flex-col"
               style="max-width: 850px"
               visible-expr="!!{$page.editor.visible}"
            >
               <PrivateStore data={{ data: { bind: '$page.editor.data' }, visible: { bind: '$page.editor.visible' } }}>
                  <div class="flex border-b p-4">
                     <div class="w-48">
                        <div class="">Ledger</div>
                        <p class="text-xs text-gray-600"></p>
                     </div>
                     <div>
                        <FieldGroup invalid-bind="invalid" visited-bind="visited">
                           <LabelsLeftLayout>
                              <TextField
                                 value-bind="data.name"
                                 label="Name"
                                 required
                                 autoFocus-expr="!{data.id}"
                                 class="w-64"
                              />
                              <TextField value-bind="data.year" label="Year" required class="w-64" />
                              <TextArea value-bind="data.description" label="Description" class="w-64" rows={4} />
                           </LabelsLeftLayout>
                        </FieldGroup>
                     </div>
                  </div>

                  <div class="flex items-center p-4">
                     <div class="">Accounts</div>
                     <Button
                        class="ml-4"
                        mod="hollow"
                        icon="fa-plus"
                        onClick={(e, { store }) => {
                           store.update('data.accounts', (accounts) => [
                              createRowEditorRecord({}),
                              ...(accounts || []),
                           ]);
                        }}
                     >
                        Add
                     </Button>
                  </div>

                  <SwissArmyGrid
                     border={false}
                     records-bind="data.accounts"
                     rowEditable
                     scrollable
                     buffered
                     style="min-height: 200px;"
                     sortField="code"
                     sortDirection="ASC"
                     class="flex-grow mx-2"
                     mod={['condensed', 'ellipsis']}
                     columns={[
                        {
                           field: 'code',
                           header: { text: 'Code', style: 'border-left-color: #ddd' },
                           editor: true,
                           required: true,
                           width: 100,
                        },
                        { field: 'description', header: 'Description', editor: true, required: true },
                        { field: 'by_party', header: 'Party', type: 'boolean', editor: true, width: 80 },
                        {
                           field: 'entries_allowed',
                           header: 'Allowed',
                           type: 'boolean',
                           editor: true,
                           width: 80,
                        },
                     ]}
                  />

                  <div class="px-4 py-5 text-right border-t">
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
            <div class="bg-gray-100 flex-grow" />
         </div>
      </div>
   </cx>
);
