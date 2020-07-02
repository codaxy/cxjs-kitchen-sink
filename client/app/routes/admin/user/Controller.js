import { POST, GET, PUT } from '../../../api/util/methods';
import { History } from 'cx/ui';
import { showErrorToast, showSuccessToast } from '../../../components/toasts';

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

      let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(!data.email.match(mailformat)){
         showErrorToast("You have entered an invalid email address!");
         return;
      }

      try {
         let result = await POST(`users/${id}`, data);
         id = result.id;

         if(result.msg) {
            let action = 'inserted new';
            if(id!='new') action = 'edited'
            showSuccessToast(`You have successfully ${action} user.`);
            History.pushState({}, null, `~/admin/users?select=${id}`);
         } else {
            showErrorToast("Email must be unique.");
         }

      } catch (err) {
         showErrorToast(err);
      }
   },
};
