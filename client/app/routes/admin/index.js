import { Sidebar, SidebarLink } from '../../components/Sidebar';
import { RedirectRoute } from 'cx/widgets';
import { AsyncSandboxedRoute } from '../../components/AsyncSandboxedRoute';

export default (
   <cx>
      <div putInto="module">Administration</div>
      <div class="flex flex-grow">
         <RedirectRoute url-bind="url" route="+" redirect="+/users" />
         <Sidebar>
            <SidebarLink href="+/users" icon="fa-user">
               User Directory
            </SidebarLink>
            <SidebarLink href="+/roles" icon="fa-check-square">
               Roles & Permissions
            </SidebarLink>
         </Sidebar>
         <AsyncSandboxedRoute
            route="+/users"
            onLoadContent={() => import(/* webpackChunkName: 'admin' */ './users').then((m) => m.default)}
         />
         <AsyncSandboxedRoute
            route="+/users/:id"
            onLoadContent={() => import(/* webpackChunkName: 'admin' */ './user').then((m) => m.default)}
         />
         <AsyncSandboxedRoute
            route="+/roles"
            onLoadContent={() => import(/* webpackChunkName: 'admin' */ './roles').then((m) => m.default)}
         />
      </div>
   </cx>
);
