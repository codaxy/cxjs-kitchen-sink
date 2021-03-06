import { Link, Submenu, Menu } from 'cx/widgets';
import { ContentPlaceholder, PureContainer } from 'cx/ui';
import Controller from './Controller';
import '../components/icons';
import UserMenu from './UserMenu';
import LogoUrl from './logo/logo.jpg';
import { ModuleLink } from './ModuleLink';

export default (
   <cx>
      <PureContainer controller={Controller}>
         <header class="w-full h-14 bg-white z-50 top-0 flex flex-row border-b">
            <div class="self-center w-64 text-center">
               <img src={LogoUrl} alt="Logo" class="h-10 mx-auto" />
            </div>
            <div class="border-r h-6 self-center" />
            <Menu horizontal class="m-2">
               <Submenu>
                  <div class="cursor-pointer py-2 px-5 flex-grow-1 w-48 text-xl">
                     <ContentPlaceholder name="module">
                        <div class="text-gray-500">Module</div>
                     </ContentPlaceholder>
                  </div>
                  <Menu putInto="dropdown" itemPadding={false}>
                     <ModuleLink
                        icon="fa-user"
                        href="~/admin"
                        name="Administration"
                        description="Create users, reset passwords, manage roles, edit permissions, etc."
                     />

                     <ModuleLink
                        icon="fa-file-invoice"
                        href="~/accounting"
                        name="Accounting"
                        description="Ledger, accounts, expenses, invoices, payments, reports, etc."
                     />

                     <ModuleLink
                        icon="fa-user-tie"
                        href="~/crm"
                        name="CRM"
                        description="Track leads, close opportunities, manage customers, etc."
                     />

                     <ModuleLink
                        icon="fa-tasks"
                        href="~/issues"
                        name="Issue Tracker"
                        description="Report bugs, track issues, create sprints, track progress..."
                     />
                  </Menu>
               </Submenu>
            </Menu>
            <div class="flex-grow" />
            <UserMenu />
         </header>
         <ContentPlaceholder />
      </PureContainer>
   </cx>
);
