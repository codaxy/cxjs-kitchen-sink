import { Sandbox, Route } from 'cx/widgets';
import { computable } from 'cx/ui';

export const SandboxedRoute = ({ route, children, prefix }) => (
   <cx>
      <Route url-bind="url" route={route} prefix={prefix}>
         <Sandbox
            key={computable('url', (url) => {
               let index = url.indexOf('?');
               return index >= 0 ? url.substring(0, index) : url;
            })}
            storage-bind="pages"
         >
            {children}
         </Sandbox>
      </Route>
   </cx>
);
