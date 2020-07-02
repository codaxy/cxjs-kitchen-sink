import { LabelsLeftLayout, History , FirstVisibleChildLayout,} from 'cx/ui';
import { Button, FieldGroup, Icon, Link, TextField, MenuItem, LookupField, LinkButton,ValidationError } from 'cx/widgets';
import { Toolbar } from '../../../components/Toolbar';
import Controller from './Controller';
import { AsyncButton } from '../../../components/AsyncButton';
import { LoadingMask } from '../../../components/LoadingMask';
import { GET } from '../../../api/util/methods';

export default (
   <cx>
      <div class="flex flex-col flex-grow" controller={Controller}>
         <Toolbar>
            <div class="px-2">
               <Link href="~/admin/users">Users</Link>
               <Icon name="fa-chevron-right" class="text-xs text-gray-500 mx-4" style="vertical-align: baseline" />
               <span visible-expr="{$route.id} == 'new'">Create a new user</span>
               <span visible-expr="{$route.id} != 'new'">Edit</span>
            </div>
         </Toolbar>
         <div class="border-t flex flex-grow">
            <LoadingMask
               style="width: 600px;"
               class="px-4 py-2 border-r"
               status-bind="$page.status"
               error-bind="$page.error"
               onRetry="onLoad"
            >
               <div class="flex border-b p-4">
                  <div>
                     <div class="">User</div>
                     <p class="text-xs text-gray-600">Profile information</p>
                  </div>
                  <div class="flex-grow" />
                  <div>
                     <FieldGroup invalid-bind="$page.invalid" visited-bind="$page.visited">
                        <LabelsLeftLayout>
                           <TextField
                              value-bind="$page.data.email"
                              label="Email"
                              required
                              autoFocus-expr="!{$page.data.id}"
                              class="w-64"
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
                           />
                           <TextField value-bind="$page.data.display_name" label="Display" required class="w-64" />
                           <LookupField
                              records-bind="$page.data.roles"
                              label="Roles"
                              style="width: 256px"
                              multiple
                              onQuery={() => GET('roles')}
                              fetchAll
                              cacheAll
                              optionTextField="name"
                              valueTextField="name"
                           />
                        </LabelsLeftLayout>
                     </FieldGroup>
                  </div>
               </div>
               <div class="px-4 py-5 text-right">
                  <LinkButton href="~/admin/users">Cancel</LinkButton>
                  <AsyncButton class="ml-2" mod="primary" onClick="onSave">
                     Save
                  </AsyncButton>
               </div>
            </LoadingMask>
            <div class="flex-grow bg-gray-100" />
         </div>
      </div>
   </cx>
);
