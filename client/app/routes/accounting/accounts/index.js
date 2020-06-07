import { KeySelection } from 'cx/ui';
import { Grid, Menu, MenuItem, openContextMenu } from 'cx/widgets';
import { LoadingMask } from '../../../components/LoadingMask';
import { Toolbar } from '../../../components/Toolbar';
import Controller from './Controller';
import Ledger from './ledger';

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

            <Ledger visible-expr="!!{$page.selection}" />

            <div class="bg-gray-100 flex-grow" />
         </div>
      </div>
   </cx>
);
