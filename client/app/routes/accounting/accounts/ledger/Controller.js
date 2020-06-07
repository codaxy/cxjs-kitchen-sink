import { POST, GET, PUT } from '../../../../api/util/methods';
import { History } from 'cx/ui';
import { showErrorToast } from '../../../../components/toasts';

export default {
   onInit() {
      this.store.delete('visited');
      if (this.store.get('id') == 'new') this.store.delete('data');
      else this.onLoad();
   },

   async onLoad() {
      let status = this.store.ref('status');
      try {
         status.set('loading');
         let id = this.store.get('id');
         let data = await GET(`ledgers/${id}`);
         this.store.set('data', data);
         status.set('ok');
      } catch (err) {
         status.set('error');
         this.store.set('error', err.message);
      }
   },

   async onSave() {
      this.store.set('visited', true);

      let { data, invalid, id } = this.store.getData();

      if (invalid) return;
      try {
         if (id == 'new') {
            let { id } = await POST('ledgers', data);
            this.store.set('id', id);
         } else {
            await PUT(`ledgers/${id}`, data);
         }
      } catch (err) {
         showErrorToast(err);
      }
   },
};
