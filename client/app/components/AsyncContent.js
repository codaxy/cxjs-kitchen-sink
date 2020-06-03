import { ContentResolver } from 'cx/ui';
import { Route } from 'cx/widgets';

export const AsyncContent = ({ onLoadContent }) => (
   <cx>
      <ContentResolver onResolve={onLoadContent}></ContentResolver>
   </cx>
);
