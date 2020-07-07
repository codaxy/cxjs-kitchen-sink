# Improved validation UX using the visited flag

Form validation in CxJS is commonly done using the `ValidationGroup` component. Let's see how that works on the login form below.

```jsx
<ValidationGroup invalid-bind="form.invalid" visited-bind="form.visited">
  <form onSubmit="onSignIn">
    <LabelsTopLayout columns={1} mod="stretch">
      <TextField
        label="Email"
        value-bind="form.email"
        required
        inputAttrs={{
          autoComplete: 'username',
        }}
      />
      <TextField
        label="Password"
        value-bind="form.password"
        required
        inputType="password"
        inputAttrs={{
          autoComplete: 'current-password',
        }}
      />
      <Button submit>Sign In</Button>
    </LabelsTopLayout>
  </form>
</ValidationGroup>
```

`ValidationGroup` will detect if there are any invalid child fields and set the `form.invalid` flag in the store to either `true` or `false`. This value can be used to disable the Sign In button like this.

```jsx
<Button disabled-bind="form.invalid" submit>
  Sign In
</Button>
```

This would ensure that the form cannot be submitted while being in the invalid state. However, this might not be the optimal user experience because the user doesn't know why the form is invalid. In CxJS, required fields are not visually marked invalid until they are visited by the user. This means that the submit button is initially disabled while there are no visual indicators on the screen what's is wrong.

For this reason an alternative approach is preferred. Instead of disabling the Sign In button, we leave it enabled and add logic in the submit handler.

```js
onSignIn(e) {
    e.preventDefault(); //prevent actual submission
    this.store.set('form.visited', true);
    let { email, password, invalid } = this.store.get('form');
    if (invalid) return;

    //actual sign-in logic comes here
}
```

The `ValidationGroup` component sets the visited flag which is passed to all inner form fields. Setting the `form.visited` to `true` will force all child form field to display their validation errors.

The next step is to add a check and exit the handler if the form is invalid and the actual sign-in logic comes after all that.
