import { GET, DELETE, POST, PUT } from '../../../api/util/methods';
import { History } from 'cx/ui';

export default {
   onInit() {
      this.onLoad(true);

      this.addTrigger('selection', ['$page.selection', '$page.data'], (selection, roles) => {
         let data =
            selection == 'new'
               ? {
                    permissions: [],
                 }
               : roles.find((r) => r.id == selection);

         this.store.set('$page.editor', {
            visible: !!data,
            data,
         });
      });
   },

   async onLoad(skipLoading) {
      let status = this.store.ref('$page.status');
      if (skipLoading === true) status.init('loading');
      else status.set('loading');
      try {
         let data = await GET('roles');
         this.store.set('$page.data', data);
         status.set('ok');
      } catch (err) {
         status.set('error');
         this.store.set('$page.error', err.message);
      }
   },

   async onDelete(e, { store }) {
      try {
         this.store.set('$page.status', 'loading');
         await DELETE(`roles/${store.get('$page.selection')}`);
         this.store.delete('$page.selection');
      } catch (err) {
         showErrorToast(err, 'Failed to delete role');
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
            data = await POST(`roles`, data);
         } else {
            await PUT(`roles/${data.id}`, data);
         }
         await this.invokeParentMethod('onLoad', !!data.id);
         this.store.set('$page.selection', data.id);
      } catch (err) {
         showErrorToast(err);
      }
   },
};
