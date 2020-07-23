import { useStoreMethods, useTrigger } from 'cx/hooks';

export default {
   onInit() {
      this.addTrigger('load', ['$page.ledgerId'], () => this.onLoad(), true);
   },

   onLoad() {
      alert('X');
   },
};
