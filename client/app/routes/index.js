import { enableCultureSensitiveFormatting, PureContainer, FirstVisibleChildLayout } from 'cx/ui';
import { RedirectRoute, Route } from 'cx/widgets';
import AppLayout from '../layout';
import Admin from './admin';

enableCultureSensitiveFormatting();

export default () => (
   <cx>
      <PureContainer outerLayout={AppLayout} layout={FirstVisibleChildLayout} visible-expr="!!{user}">
         <RedirectRoute url-bind="url" route="~/" redirect="~/admin" />
         <Route route="~/admin(/)" url-bind="url" prefix>
            <Admin />
         </Route>
      </PureContainer>
   </cx>
);
