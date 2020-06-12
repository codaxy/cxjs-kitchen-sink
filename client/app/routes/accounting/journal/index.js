import { Toolbar } from '../../../components/Toolbar';
import { LookupField } from 'cx/widgets';
import { SwissArmyGrid } from '../../../components/swiss-army-grid/SwissArmyGrid';

export default (
   <cx>
      <div class="flex flex-col flex-grow">
         <Toolbar>
            Active Ledger
            <LookupField />
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
