import { DELETE, GET, POST, PUT } from '../../../api/util/methods';

export default {
   onInit() {
      this.onLoad(true);
   },

   onAdd() {
      this.store.set('$page.selection', 'new');
   },

   onMasterLoad(skipLoading) {
      return this.onLoad(skipLoading);
   },

   async onLoad(skipLoading) {
      let status = this.store.ref('$page.status');
      if (skipLoading === true) status.init('loading');
      else status.set('loading');
      try {
         let data = await GET('ledgers');
         this.store.set('$page.data', data);
         this.store.init('$page.selection', data[0]?.id);
         status.set('ok');
      } catch (err) {
         status.set('error');
         this.store.set('$page.error', err.message);
      }
   },

   async onDelete(e, { store }) {
      try {
         this.store.set('$page.status', 'loading');
         let selection = this.store.get('$page.selection');
         this.store.delete('$page.selection');
         await DELETE(`ledgers/${selection}`);
      } catch (err) {
         showErrorToast(err, 'Failed to delete');
      } finally {
         this.onLoad();
      }
   },

   onAdd() {
      this.store.set('$page.selection', 'new');
   },

   async onSave(e, { store }) {
      store.set('visited', true);
      let { data, invalid } = store.getData();
      if (invalid) return;
      try {
         if (!data.id) {
            data = await POST(`ledgers`, data);
         } else {
            await PUT(`ledgers/${data.id}`, data);
         }
         await this.invokeParentMethod('onLoad', !!data.id);
         this.store.set('$page.selection', data.id);
      } catch (err) {
         showErrorToast(err);
      }
   },
};
