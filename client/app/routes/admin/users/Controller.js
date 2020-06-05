import { GET, DELETE } from '../../../api/util/methods';
import { History } from 'cx/ui';

export default {
   onInit() {
      this.store.init('$page.sort', {
         field: 'created_time',
         direction: 'DESC',
      });
      this.onLoad(true);
   },

   async onLoad(skipLoading) {
      let status = this.store.ref('$page.status');
      if (skipLoading === true) status.init('loading');
      else status.set('loading');
      try {
         let data = await GET('users');
         this.store.set('$page.data', data);
         status.set('ok');
      } catch (err) {
         status.set('error');
         this.store.set('$page.error', err.message);
      }
   },

   onEdit(e, { store }) {
      History.pushState({}, null, `~/admin/users/${store.get('$page.selection')}`);
   },

   async onDelete(e, { store }) {
      try {
         this.store.set('$page.status', 'loading');
         await DELETE(`users/${store.get('$page.selection')}`);
         this.store.delete('$page.selection');
      } catch (err) {
         showErrorToast(err, 'Failed to delete user');
      } finally {
         this.onLoad();
      }
   },

   onResetPassword() {
      let { selection, data } = this.store.get('$page');
      let user = data.find((u) => u.id == selection);
      this.store.set('$page.resetPassword', {
         user,
      });
   },
};
