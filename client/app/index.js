import { History, Url, PureContainer, Widget, startHotAppLoop, ContentResolver, Localization, Culture } from 'cx/ui';
import { Store } from 'cx/data';
import { Timing, Debug } from 'cx/util';

//css
import './index.scss';
import './index.css';

//store
const store = new Store({ data: { lang: 'en' } });

//routing
Url.setBaseFromScript('vendor*.js');
History.connect(store, 'url');

//debug
Widget.resetCounter();
Timing.enable('app-loop');
Debug.enable('app-data');

import SignIn from './routes/sign-in';
import { AsyncContent } from './components/AsyncContent';

//app loop
startHotAppLoop(
   module,
   document.getElementById('app'),
   store,
   <cx>
      <ContentResolver
         params-bind="lang"
         onResolve={(lang) => {
            Localization.setCulture(lang);
            Culture.setCulture(lang);
            return (
               <cx>
                  <PureContainer visible-expr="!{user}">
                     <SignIn />
                  </PureContainer>
                  <AsyncContent
                     onLoadContent={() => import(/* webpackChunkName: "routes" */ './routes').then((m) => m.default)}
                  />
               </cx>
            );
         }}
      />
   </cx>
);
