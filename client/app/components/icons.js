import { Icon } from 'cx/widgets';
import { VDOM, CSS } from 'cx/ui';

Icon.registerFactory((name, props) => {
   props = { ...props };
   props.className = CSS.expand('fa', name, props.className);
   return <i {...props} />;
});
