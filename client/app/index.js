import { History, Url, PureContainer, Widget, startHotAppLoop } from 'cx/ui';
import { Store } from 'cx/data';
import { Timing, Debug } from 'cx/util';

//css
import './index.scss';
import './index.css';

//store
const store = new Store();

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
      <PureContainer visible-expr="!{user}">
         <SignIn />
      </PureContainer>
      <AsyncContent onLoadContent={() => import(/* webpackChunkName: "routes" */ './routes').then((m) => m.default)} />
   </cx>
);
