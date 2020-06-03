import { LabelsLeftLayout, History } from 'cx/ui';
import { Button, FieldGroup, Icon, Link, TextField, MenuItem } from 'cx/widgets';
import { Toolbar } from '../../../components/Toolbar';
import Controller from './Controller';
import { AsyncButton } from '../../../components/AsyncButton';
import { LoadingOverlay } from '../../../components/LoadingOverlay';

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
         <div class="border-t">
            <LoadingOverlay
               style="max-width: 700px; min-height: 200px"
               class="px-4 py-2"
               status-bind="$page.status"
               error-bind="$page.error"
            >
               <div class="flex border-b p-4">
                  <div>
                     <div class="">Core</div>
                     <p class="text-xs text-gray-600">Login information</p>
                  </div>
                  <div class="flex-grow" />
                  <div>
                     <FieldGroup invalid-bind="$page.invalid" visited-bind="$page.visited">
                        <LabelsLeftLayout>
                           <TextField
                              value-bind="$page.data.email"
                              label="Email"
                              required
                              autoFocus-expr="{$route.id} == 'new'"
                              class="w-64"
                           />
                           <TextField value-bind="$page.data.display_name" label="Display" required class="w-64" />
                        </LabelsLeftLayout>
                     </FieldGroup>
                  </div>
               </div>
               <div class="px-4 py-5 text-right">
                  <Button
                     onClick={() => {
                        History.pushState({}, null, '~/admin/users');
                     }}
                  >
                     Cancel
                  </Button>
                  <AsyncButton class="ml-2" mod="primary" onClick="onSave">
                     Save
                  </AsyncButton>
               </div>
            </LoadingOverlay>
         </div>
      </div>
   </cx>
);
