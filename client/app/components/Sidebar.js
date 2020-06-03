import { Link, Icon } from 'cx/widgets';

export const Sidebar = ({ children }) => (
   <cx>
      <div class="w-64 border-r py-4 px-4">{children}</div>
   </cx>
);

export const SidebarLink = ({ href, children, icon }) => (
   <cx>
      <Link
         href={href}
         url-bind="url"
         class="block py-2 px-4 hover:bg-gray-300 rounded-full mb-1 flex items-center"
         activeClass="bg-blue-600 hover:bg-blue-600 text-white"
         match="subroute"
      >
         <Icon name={icon} class="mr-3 relative w-5 h-5 text-xl leading-none" style="top: -1px" />
         {children}
      </Link>
   </cx>
);
