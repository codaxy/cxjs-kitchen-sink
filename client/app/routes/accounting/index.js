import { Sidebar, SidebarLink } from '../../components/Sidebar';
import { RedirectRoute } from 'cx/widgets';
import { AsyncSandboxedRoute } from '../../components/AsyncSandboxedRoute';

export default (
   <cx>
      <div putInto="module">Accounting</div>
      <div class="flex flex-grow">
         <RedirectRoute url-bind="url" route="+" redirect="+/accounts" />
         <Sidebar>
            <SidebarLink href="+/dashboard" icon="fa-chart-bar">
               Dashboard
            </SidebarLink>
            <SidebarLink href="+/journal" icon="fa-edit">
               Journal
            </SidebarLink>
            <SidebarLink href="+/accounts" icon="fa-list-ol">
               Chart of Accounts
            </SidebarLink>
            <SidebarLink href="+/parties" icon="fa-users">
               Parties
            </SidebarLink>
         </Sidebar>
         <AsyncSandboxedRoute
            route="+/accounts"
            onLoadContent={() => import(/* webpackChunkName: 'accounting' */ './accounts').then((m) => m.default)}
         />
         <AsyncSandboxedRoute
            route="+/parties"
            onLoadContent={() => import(/* webpackChunkName: 'accounting' */ './parties').then((m) => m.default)}
         />
         <AsyncSandboxedRoute
            route="+/journal"
            onLoadContent={() => import(/* webpackChunkName: 'accounting' */ './journal').then((m) => m.default)}
         />
      </div>
   </cx>
);
