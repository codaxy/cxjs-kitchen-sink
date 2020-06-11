import { Container, VDOM, Widget } from 'cx/ui';
import { Icon } from 'cx/widgets';

export class LoadingMask extends Container {
   declareData(...args) {
      super.declareData(...args, {
         status: undefined,
         loading: undefined,
         errorMessage: undefined,
         errorTitle: undefined,
         loadingText: undefined,
         loadingIcon: undefined,
      });
   }

   explore(context, instance) {
      instance.loadingSignal = false;
      context.push('setLoading', () => {
         instance.loadingSignal = true;
      });
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop('setLoading');
   }

   render(context, instance, key) {
      let { data, loading } = instance;
      return (
         <LoadingMaskCmp
            key={key}
            instance={instance}
            loading={loading || data.status == 'loading' || data.loading}
            data={data}
         >
            {this.renderChildren(context, instance)}
         </LoadingMaskCmp>
      );
   }
}

LoadingMask.prototype.styled = true;
LoadingMask.prototype.baseClass = 'loadingmask';
LoadingMask.prototype.loadingText = 'Loading...';
LoadingMask.prototype.loadingIcon = 'loading';
LoadingMask.prototype.errorTitle = 'Failed to load data';

class LoadingMaskCmp extends VDOM.Component {
   render() {
      let { children, loading, instance, data } = this.props;
      let { CSS, baseClass } = instance.widget;
      let { classNames, style, errorMessage, errorTitle, status } = data;
      return (
         <div className={classNames} style={style}>
            {children}
            {status != 'error' && (
               <div className={CSS.expand(CSS.element(baseClass, 'loading', { loading: loading }))}>
                  {Icon.render(data.loadingIcon, {
                     className: CSS.element(baseClass, 'loading-icon'),
                  })}
                  <div>{data.loadingText}</div>
               </div>
            )}
            {status == 'error' && (
               <div className={CSS.element(baseClass, 'error')}>
                  <div>
                     <div className={CSS.element(baseClass, 'error-title')}>{errorTitle}</div>
                     <div className={CSS.element(baseClass, 'error-message')}>{errorMessage}</div>
                     <div className={CSS.element(baseClass, 'buttons')}>
                        <button
                           className={CSS.block('button')}
                           onClick={(e) => {
                              instance.set('status', 'ok');
                           }}
                        >
                           Dismiss
                        </button>
                        {instance.widget.onRetry && (
                           <button
                              className={CSS.expand(CSS.block('button'), 'cxm-primary', 'ml-2')}
                              onClick={(e) => {
                                 instance.set('status', 'ok');
                                 instance.invoke('onRetry', e, instance);
                              }}
                           >
                              Retry
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            )}
         </div>
      );
   }
}

export class LoadingSignal extends Widget {
   declareData(...args) {
      super.declareData(...args, {
         loading: undefined,
      });
   }

   explore(context, instance) {
      if (instance.data.loading && isFunction(context.setLoading)) context.setLoading();
   }

   render() {
      return null;
   }
}
