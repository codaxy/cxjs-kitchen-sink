import LogoUrl from '../../layout/logo/logo.jpg';
import { LabelsTopLayout, computable } from 'cx/ui';
import { TextField, PrivateStore, Button, ValidationGroup, Menu, Submenu } from 'cx/widgets';
import Controller from './Controller';
import '../../components/theme/fields';
import t from './translations';
import { supportedLanguages } from '../../layout/supportedLanguages';

export default () => (
   <cx>
      <div class="w-full h-full flex items-center justify-center -mt-10 bg-gray-200">
         <div style="width: 350px">
            <div class="flex justify-center mb-4">
               <img src={LogoUrl} alt="logo" class="h-14" />
            </div>

            <PrivateStore data={{ user: { bind: 'user' }, lang: { bind: 'lang' } }} controller={Controller}>
               <form class="relative border-2 rounded-lg pt-8 pb-10 px-8 bg-white" onSubmit="onSignIn">
                  <Menu horizontal class="absolute" style="right: 4px; top: 4px">
                     <Submenu arrow>
                        <span
                           class="text-sm text-gray-600"
                           text={computable('lang', (lang) => supportedLanguages[lang || 'en'])}
                        />
                        <Menu putInto="dropdown">
                           {Object.keys(supportedLanguages).map((lang) => (
                              <cx>
                                 <a onClick="onChangeLanguage" data-lang={lang} text={supportedLanguages[lang]} />
                              </cx>
                           ))}
                        </Menu>
                     </Submenu>
                  </Menu>
                  <p class="mb-2">{t.signInMessage}</p>
                  <ValidationGroup invalid-bind="invalid" visited-bind="visited">
                     <LabelsTopLayout columns={1} mod="stretch">
                        <TextField
                           label={t.email}
                           value-bind="email"
                           class="w-full"
                           required
                           inputAttrs={{
                              autoComplete: 'username',
                           }}
                        />
                        <TextField
                           label={t.password}
                           value-bind="password"
                           class="w-full"
                           required
                           inputType="password"
                           inputAttrs={{
                              autoComplete: 'current-password',
                           }}
                        />
                        <Button mod="primary" class="w-full mt-4" submit>
                           {t.signIn}
                        </Button>
                     </LabelsTopLayout>
                  </ValidationGroup>
               </form>
            </PrivateStore>
         </div>
      </div>
   </cx>
);
