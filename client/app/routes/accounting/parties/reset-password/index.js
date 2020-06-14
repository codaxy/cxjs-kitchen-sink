import { Window, TextField, PrivateStore, Button, ValidationGroup } from 'cx/widgets';
import { LabelsTopLayout } from 'cx/ui';
import { AsyncButton } from '../../../../components/AsyncButton';
import { POST } from '../../../../api/util/methods';
import { showErrorToast, showSuccessToast } from '../../../../components/toasts';

export default () => (
   <cx>
      <Window modal center bodyClass="px-4 pt-2 pb-4" title="Reset Password" visible-bind="$page.resetPassword">
         <PrivateStore
            data={{
               user: { bind: '$page.resetPassword.user' },
            }}
         >
            <ValidationGroup invalid-bind="invalid" visited-bind="visited">
               <LabelsTopLayout columns={2} mod="stretch">
                  <TextField label="Email" value-bind="user.email" readOnly />
                  <TextField label="Name" value-bind="user.display_name" readOnly />
                  <TextField
                     label="New Password"
                     value-bind="password"
                     required
                     autoFocus
                     inputType="password"
                     minLength={6}
                     inputAttrs={{
                        autoComplete: 'new-password',
                     }}
                  />
                  <TextField
                     label="Confirm Password"
                     value-bind="confirm"
                     required
                     inputType="password"
                     inputAttrs={{
                        autoComplete: 'new-password',
                     }}
                     validationParams-bind="password"
                     onValidate={(confirm, instance, password) => confirm != password && 'Passwords do not match.'}
                  />
               </LabelsTopLayout>
            </ValidationGroup>
            <div putInto="footer" class="flex">
               <Button dismiss class="ml-auto">
                  Cancel
               </Button>
               <AsyncButton
                  mod="primary"
                  class="ml-2"
                  onClick={async (e, { store, parentOptions }) => {
                     store.set('visited', true);
                     let { password, invalid, user } = store.getData();
                     if (invalid) return;

                     try {
                        await POST(`users/${user.id}/password`, { password });
                        parentOptions.dismiss();
                        showSuccessToast(`The password for user ${user.display_name} has been successfuly changed.`);
                     } catch (err) {
                        showErrorToast(err);
                     }
                  }}
               >
                  Reset
               </AsyncButton>
            </div>
         </PrivateStore>
      </Window>
   </cx>
);
