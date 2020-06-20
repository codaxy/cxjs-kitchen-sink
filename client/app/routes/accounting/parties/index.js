import { Toolbar } from '../../../components/Toolbar';
import { Button, Menu, MenuItem, Grid, TextField, openContextMenu, Link } from 'cx/widgets';
import { KeySelection, History } from 'cx/ui';
import '../../../util/formatting/relativetime';
import Controller from './Controller';
import { LoadingMask } from '../../../components/LoadingMask';

import { getSearchQueryPredicate } from 'cx/util';
import { SearchField } from '../../../components/SearchField';
import { SwissArmyGrid } from '../../../components/swiss-army-grid/SwissArmyGrid';

const toolbarItems = (
   <cx>
      <MenuItem
         onClick={() => {
            History.pushState({}, null, '~/accounting/parties/new');
         }}
         autoClose
         icon="fa-plus"
      >
         Add Party
      </MenuItem>
      <MenuItem autoClose disabled-expr="!{$page.selection}" onClick="onEdit" icon="fa-pen">
         Edit Party
      </MenuItem>
      <MenuItem
         autoClose
         disabled-expr="!{$page.selection}"
         onClick="onDelete"
         icon="fa-trash"
         confirm="Are you sure that you want to delete the selected party?"
      >
         Delete Party
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
            <SearchField value={{ bind: '$page.filter.name.value', debounce: 300 }} placeholder="Search parties..." />
            {toolbarItems}
         </Toolbar>

         <LoadingMask status-bind="$page.status" error-bind="$page.error" onRetry="onLoad" className="flex-grow">
            <SwissArmyGrid
               scrollable
               mod="fixed-layout"
               sortField-bind="$page.sort.field"
               sortDirection-bind="$page.sort.direction"
               buffered
               filterParams-bind="$page.filter.query"
               onCreateFilter={(query) => {
                  let sp = getSearchQueryPredicate(query);
                  return (record) => sp(record.name) || sp(record.email);
               }}
               emptyText="There is no data matching the given search criteria."
               filter-bind="$page.filter"
               columns={[
                  {
                     field: 'name',
                     header: 'Name',
                     sortable: true,
                     resizable: true,
                     defaultWidth: 300,
                  },
                  {
                     field: 'date',
                     header: 'Since',
                     sortable: true,
                     defaultWidth: 150,
                     format: 'relativetime',
                  },
                  {
                     field: 'email',
                     header: 'Email',
                     sortable: true,
                     resizable: true,
                     defaultWidth: 200,
                  },
                  {
                     field: 'website',
                     header: 'Website',
                     sortable: true,
                     resizable: true,
                     defaultWidth: 200,
                  },
                  {
                     field: 'country',
                     header: 'Country',
                     sortable: true,
                     resizable: true,
                     defaultWidth: 200,
                  },
                  {
                     field: 'city',
                     header: 'City',
                     sortable: true,
                     resizable: true,
                     defaultWidth: 200,
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
      </div>
   </cx>
);
