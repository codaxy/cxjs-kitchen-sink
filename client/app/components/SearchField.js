import { TextField } from 'cx/widgets';

export const SearchField = (props) => (
   <cx>
      <TextField
         inputClass="bg-gray-200 rounded-full focus:bg-white"
         inputStyle="padding-top: 5px; padding-bottom: 5px; padding-left: 28px"
         icon="fa-search"
         class="w-48 h-auto"
         showClear
         inputAttrs={{
            autoComplete: 'off',
         }}
         {...props}
      />
   </cx>
);
