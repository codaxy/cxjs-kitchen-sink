export default {
   onInit() {
      this.addTrigger('auto-close-global-menu', ['url'], () => {
         this.store.set('global.menu.visible', false);
      });
   },
};
