import { Toolbar } from '../../../components/Toolbar';
import { LookupField } from 'cx/widgets';
import { SwissArmyGrid } from '../../../components/swiss-army-grid/SwissArmyGrid';
import { GET } from '../../../api/util/methods';
import Controller from './Controller';

export default () => (
   <cx>
      <div class="flex flex-col flex-grow" controller={Controller}>
         <Toolbar>
            Active Ledger:
            <LookupField
               onQuery={() => {
                  return GET('ledgers');
               }}
               fetchAll
               cacheAll
               optionTextField="name"
               value-bind="$page.ledgerId"
               text-bind="$page.ledgerText"
               required
            />
         </Toolbar>
         <SwissArmyGrid
            class="flex-grow"
            cellEditable
            scrollable
            buffered
            border={false}
            records={[{}, {}, {}]}
            columns={[
               {
                  field: 'date',
                  header: 'Date',
                  width: 100,
                  format: 'date',
                  editor: true,
               },
               {
                  field: 'account',
                  header: 'Account',
               },
               {
                  field: 'description',
                  header: 'Description',
                  editor: true,
               },
               {
                  field: 'party',
                  header: 'Party',
               },
               {
                  field: 'debit',
                  header: 'Debit',
               },
               {
                  field: 'credit',
                  header: 'Credit',
               },
            ]}
         />
      </div>
   </cx>
);
