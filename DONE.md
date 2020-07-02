# CxJS Enterprise Demo

### Author
##### Vladimir Uzelac 
>Github: [uzelac92](https://github.com/uzelac92)
#

### TODO - Email validation
User cannot insert/edit email or other data if:
  - Email structure is invalid (must be i.e. 'test2@example.com')
  - Email must be unique (checks if entered email already exists)

## Solution

Steps written bellow are not part of solution. This only proves as a one point of view how I done the problems explained in TODO.

My solution is consisted of two parts:
  - Creating API endpoint for getting existing user with given `email` data
  - CxJS parameter `onValidate` for front Email validation

### API Endpoint

```sh
server.get('/api/users/email/:email', async (req, res) => {
      let data = await prisma.user.findOne({
         where: {
            email: req.params.email,
         },
      });
      send(res, 200, data);
});
```

In here client sends `get` request with `email` from TextArea via `onValidate={}` and receives either NULL or Object (found user).

### Email Validation
```sh
onValidate={async (v) => {
     const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     if (!re.test(v)) {
         return 'Invalid email structure.'
     } else {
        const exists = await GET(`users/email/${v}`) != null ? true : false;
        if(exists) {
           return "Email is already taken."
        } else {
           return false;
        }
     }
}}
help={
     <div layout={FirstVisibleChildLayout}>
       <ValidationError />
       <Icon name="check" style="color:green" />
     </div>
}
```
Code snippet above must be attached to TextArea which is input for email and it does whole job regarding email validation. The method `onValidate` is called whenever TextArea has a value inside whereas a callback function is called with forwarded value (text String) `v`.

First part is with regular expressions where as with declared rules value is tested and accordingly to result appropriate message is displayed if rules are not followed or it goes to next if statement.
Second `if statement` is where we user API endpoint and call get request for finding user with specific email address. If it's found appropriate message is displayed or else entire validation is therefore done and exited.

