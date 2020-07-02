export default {
   onSignIn(e) {
      e.preventDefault();
      this.store.set('visited', true);
      let { email, password, invalid } = this.store.getData();
      if (invalid) return;
      //TODO: Send to the server
      this.store.set('user', {
         email,
         displayName: 'Test User',
      });
   },
};
