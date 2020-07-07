import { enableCultureSensitiveFormatting, PureContainer, FirstVisibleChildLayout } from 'cx/ui';
import { RedirectRoute, Route } from 'cx/widgets';
import AppLayout from '../layout';

import Admin from './admin';
import Accounting from './accounting';
import UnderConstruction from './under-construction';

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
         <Route route="~/crm" url-bind="url" prefix>
            <UnderConstruction />
         </Route>
         <Route route="~/issues" url-bind="url" prefix>
            <UnderConstruction />
         </Route>
      </PureContainer>
   </cx>
);
