import { SandboxedRoute } from './SandboxedRoute';
import { AsyncContent } from './AsyncContent';

export const AsyncSandboxedRoute = ({ route, prefix, onLoadContent }) => (
   <cx>
      <SandboxedRoute route={route} prefix={prefix}>
         <AsyncContent onLoadContent={onLoadContent} />
      </SandboxedRoute>
   </cx>
);
