import { Link, Icon, MenuItem } from 'cx/widgets';

export const ModuleLink = ({ name, description, icon, href }) => (
   <cx>
      <MenuItem autoClose pad={false}>
         <div>
            <Link href={href} class="block relative pl-16 py-2 pr-4">
               <div class="font-bold" text={name} style="font-size: 16px" />
               <div class="text-gray-700 text-xs" text={description} />
               <Icon name={icon} class="absolute text-blue-600" style="left: 20px; top: 14px; font-size: 24px" />
            </Link>
         </div>
      </MenuItem>
   </cx>
);
