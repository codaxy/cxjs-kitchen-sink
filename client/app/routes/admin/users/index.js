import { Toolbar } from '../../../components/Toolbar';
import { Button, Menu, MenuItem, Grid, TextField, openContextMenu, Link } from 'cx/widgets';
import { KeySelection, History } from 'cx/ui';
import '../../../util/formatting/relativetime';
import Controller from './Controller';
import { LoadingOverlay } from '../../../components/LoadingOverlay';
import ResetPassword from './reset-password';
import { getSearchQueryPredicate } from 'cx/util';
import { SearchField } from '../../../components/SearchField';

const toolbarItems = (
   <cx>
      <MenuItem
         onClick={() => {
            History.pushState({}, null, '~/admin/users/new');
         }}
         autoClose
         icon="fa-plus"
      >
         Add User
      </MenuItem>
      <MenuItem autoClose disabled-expr="!{$page.selection}" onClick="onEdit" icon="fa-pen">
         Edit User
      </MenuItem>
      <MenuItem
         autoClose
         disabled-expr="!{$page.selection}"
         onClick="onDelete"
         icon="fa-trash"
         confirm="Are you sure that you want to delete the selected user?"
      >
         Delete User
      </MenuItem>
      <MenuItem autoClose disabled-expr="!{$page.selection}" onClick="onResetPassword" icon="fa-key">
         Reset Password
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
            <SearchField value={{ bind: '$page.filter.query', debounce: 300 }} placeholder="Search users..." />
            {toolbarItems}
         </Toolbar>

         <ResetPassword visible-bind="$page.resetPassword" />

         <LoadingOverlay status-bind="$page.status" error-bind="$page.error" onRetry="onLoad" className="flex-grow">
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
                     field: 'email',
                     header: 'Email',
                     sortable: true,
                     resizable: true,
                     defaultWidth: 300,
                  },
                  { field: 'display_name', header: 'Name', sortable: true, resizable: true, defaultWidth: 300 },
                  {
                     field: 'created_time',
                     header: 'Created',
                     sortable: true,
                     defaultWidth: 150,
                     format: 'relativetime',
                  },
                  {
                     field: 'last_login_time',
                     header: 'Last Login',
                     sortable: true,
                     defaultWidth: 150,
                     format: 'relativetime|never',
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
      </div>
   </cx>
);
