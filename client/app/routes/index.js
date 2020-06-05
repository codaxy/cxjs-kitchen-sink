import { enableCultureSensitiveFormatting, PureContainer, FirstVisibleChildLayout } from 'cx/ui';
import { RedirectRoute, Route } from 'cx/widgets';
import AppLayout from '../layout';

import Admin from './admin';
import Accounting from './accounting';

enableCultureSensitiveFormatting();

export default () => (
   <cx>
      <PureContainer outerLayout={AppLayout} layout={FirstVisibleChildLayout} visible-expr="!!{user}">
         <RedirectRoute url-bind="url" route="~/" redirect="~/admin" />
         <Route route="~/admin" url-bind="url" prefix>
            <Admin />
         </Route>
         <Route route="~/accounting" url-bind="url" prefix>
            <Accounting />
         </Route>
      </PureContainer>
   </cx>
);
