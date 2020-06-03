import { DataProxy, createFunctionalComponent } from 'cx/ui';
import { Button, Icon, PureContainer, Text } from 'cx/widgets';
import { Suspense } from './Suspense';

export const LoadingOverlay = createFunctionalComponent(
   ({
      status,
      loading,
      onRetry,
      children,
      icon = 'loading',
      loadingText = 'Loading...',
      error,
      errorMessage,
      style,
      class: className,
      className: className2,
      mod,
      suspenseTimeout = 5000,
   }) => {
      let content = (
         <cx>
            <DataProxy
               data={{
                  $status: status,
                  $loading: loading,
               }}
            >
               <Suspense loading-expr="{$loading} || {$status} == 'loading'" timeout={suspenseTimeout}>
                  {children}
               </Suspense>
               <div class="cxb-loading-overlay-container" mod={mod} if-expr="{$status} == 'error'">
                  <div class="text-red-600 text-lg px-8">Failed to load data</div>
                  <div class="px-8 mt-2" text={errorMessage || error} />
                  <div class="mt-4" ws>
                     <Button
                        onClick={(e, { store }) => {
                           store.set('$status', 'ok');
                        }}
                        text={'Dismiss'}
                        class="mr-1"
                     />
                     <Button mod="primary" onClick={onRetry} if={Boolean(onRetry)} text="Retry" />
                  </div>
               </div>
               <div
                  if-expr="{$status} != 'error'"
                  mod={mod}
                  class={{
                     'cxb-loading-overlay-container': true,
                     'cxs-animated': true,
                     on: { expr: "{$loading} || {$status} == 'loading'" },
                  }}
                  style={style}
               >
                  <div class="flex items-center">
                     <Icon name={icon} class="w-8 h-8 mr-2" />
                     <span text={loadingText} class="user-unselectable-text" />
                  </div>
               </div>
            </DataProxy>
         </cx>
      );

      //if any of these is defined apply wrap a div around the content
      if (className || style || className2)
         return (
            <cx>
               <div className={className || className2} style={style} class="relative">
                  {content}
               </div>
            </cx>
         );

      return content;
   }
);
