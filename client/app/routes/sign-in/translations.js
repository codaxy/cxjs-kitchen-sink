import { createTranslationDictionary } from '../../util/translations';

const t = createTranslationDictionary('sign-in', {
   email: 'Email',
   password: 'Password',
   signIn: 'Sign In',
   signInMessage: 'Sign in to Kitchen Sink',
});

t.addTranslations('sr', {
   email: 'Email',
   password: 'Lozinka',
   signIn: 'Prijava',
   signInMessage: 'Prijavite se u Kitchen Sink',
});

export default t;
