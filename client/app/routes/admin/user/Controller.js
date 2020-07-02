import { POST, GET, PUT } from '../../../api/util/methods';
import { History } from 'cx/ui';
import { showErrorToast } from '../../../components/toasts';

export default {
   onInit() {
      this.store.delete('$page.visited');
      if (this.store.get('$route.id') == 'new') this.store.delete('$page.data');
      else this.onLoad();
   },

   async onLoad() {
      let status = this.store.ref('$page.status');
      try {
         status.set('loading');
         let id = this.store.get('$route.id');
         let data = await GET(`users/${id}`);
         this.store.set('$page.data', data);
         status.set('ok');
      } catch (err) {
         status.set('error');
         this.store.set('$page.error', err.message);
      }
   },

   async onSave() {
      this.store.set('$page.visited', true);

      let { data, invalid } = this.store.get('$page');
      let { id } = this.store.get('$route');

      if (invalid) return;

      try {
         if (id == 'new') {
            let result = await POST('users', data);
            id = result.id;
         } else {
            await PUT(`users/${id}`, data);
         }

         History.pushState({}, null, `~/admin/users?select=${id}`);
      } catch (err) {
         showErrorToast(err);
      }
   },
};