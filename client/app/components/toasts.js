import { Button, Toast } from 'cx/widgets';
import { Store } from 'cx/data';

export function toast(options) {
   if (options instanceof Error) options = options.message;
   if (typeof options == 'string')
      options = {
         message: options,
      };

   Toast.create({
      timeout: 10000,
      ...options,
   }).open();
}

export function showErrorToast(err, title = 'Error') {
   let store = new Store();
   let dismiss = Toast.create({
      items: (
         <cx>
            <div>
               <div class="flex items-center">
                  <div class="mr-4 flex-grow minw-64">{title}</div>
                  <Button
                     visible-expr="{timer} != 'off'"
                     mod="hollow"
                     text-tpl="{count}"
                     onClick={() => {
                        store.set('timer', 'off');
                     }}
                  />
                  <Button mod={'hollow'} dismiss icon="close" />
               </div>
               <p class="text-sm">{String(err.message || err)}</p>
            </div>
         </cx>
      ),
      mod: 'error',
   }).open(store);

   let count = 10;

   let timer = setInterval(() => {
      if (--count == 0) {
         clearInterval(timer);
         if (store.get('timer') != 'off') dismiss();
      } else store.set('count', count);
   }, 1000);
}

export function showSuccessToast(message) {
   return toast({ message, mod: 'success' });
}
