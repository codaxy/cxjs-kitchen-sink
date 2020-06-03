import { Submenu, Menu, MenuItem, Icon } from 'cx/widgets';

export default (
   <cx>
      <Menu horizontal class="self-center mr-2">
         <Submenu class="rounded">
            <div class="pl-1 pr-4 py-1 flex items-center">
               <div class="rounded-full bg-gray-200 w-10 h-10 mr-2 flex items-center justify-center">
                  <Icon name="fa-user" class="text-gray-400 w-6 h-6" style="font-size: 24px" />
               </div>
               <div>
                  <div text-bind="user.displayName" class="leading-tight"></div>
                  <div text-bind="user.email" class="text-xs text-gray-500 leading-none"></div>
               </div>
            </div>
            <Menu putInto="dropdown">
               <MenuItem
                  autoClose
                  onClick={(e, { store }) => {
                     store.delete('user');
                     //TODO: Proper sign out
                  }}
                  text="Sign Out"
               />
            </Menu>
         </Submenu>
      </Menu>
   </cx>
);
