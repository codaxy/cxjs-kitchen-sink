import { LabelsLeftLayout, History } from 'cx/ui';
import { Button, FieldGroup, Icon, Link, TextField, MenuItem, LookupField, DateField, LinkButton } from 'cx/widgets';
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
               <Link href="~/accounting/parties">Parties</Link>
               <Icon name="fa-chevron-right" class="text-xs text-gray-500 mx-4" style="vertical-align: baseline" />
               <span visible-expr="{$route.id} == 'new'">Create a new party</span>
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
               <FieldGroup invalid-bind="$page.invalid" visited-bind="$page.visited">
                  <div class="flex border-b p-4">
                     <div>
                        <div class="">Party</div>
                        <p class="text-xs text-gray-600">Core information.</p>
                     </div>
                     <div class="flex-grow" />
                     <div>
                        <LabelsLeftLayout>
                           <TextField
                              value-bind="$page.data.name"
                              label="Name"
                              required
                              autoFocus-expr="!{$page.data.id}"
                              class="w-64"
                           />
                           <DateField value-bind="$page.data.date" label="Since" required />
                           <TextField value-bind="$page.data.tax_number" label="Tax No." class="w-64" />
                        </LabelsLeftLayout>
                     </div>
                  </div>
                  <div class="flex border-b p-4">
                     <div>
                        <div class="">Contact</div>
                        <p class="text-xs text-gray-600">Phone, Email, Website</p>
                     </div>
                     <div class="flex-grow" />
                     <div>
                        <LabelsLeftLayout>
                           <TextField value-bind="$page.data.phone" label="Phone" class="w-64" />
                           <TextField value-bind="$page.data.email" label="Email" class="w-64" />
                           <TextField value-bind="$page.data.website" label="Website" class="w-64" />
                        </LabelsLeftLayout>
                     </div>
                  </div>
                  <div class="flex border-b p-4">
                     <div>
                        <div class="">Address</div>
                        <p class="text-xs text-gray-600">Country, city, street..</p>
                     </div>
                     <div class="flex-grow" />
                     <div>
                        <LabelsLeftLayout>
                           <TextField value-bind="$page.data.address1" label="Line 1" class="w-64" />
                           <TextField value-bind="$page.data.address2" label="Line 2" class="w-64" />
                           <TextField value-bind="$page.data.city" label="City" class="w-64" />
                           <TextField value-bind="$page.data.postal_code" label="Postal Code" class="w-64" />
                           <TextField value-bind="$page.data.country_code" label="Country Code" class="w-64" />
                        </LabelsLeftLayout>
                     </div>
                  </div>
               </FieldGroup>
               <div class="px-4 py-5 text-right">
                  <LinkButton href="~/accounting/parties">Cancel</LinkButton>
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
