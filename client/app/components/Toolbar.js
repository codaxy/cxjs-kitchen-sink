import { Menu } from 'cx/widgets';

export const Toolbar = ({ children }) => (
   <cx>
      <Menu horizontal class="block flex p-2 text-sm text-gray-700 space-x-2 items-center" overflow>
         {children}
      </Menu>
   </cx>
);
