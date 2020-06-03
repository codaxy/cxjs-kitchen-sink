import {PureContainer, VDOM} from "cx/ui";

export class Suspense extends PureContainer {
    declareData(...args) {
        super.declareData(...args, {
            loading: undefined,
            timeout: undefined
        })
    }

    render(context, instance, key) {
        let {data} = instance;
        return <SuspenseCmp key={key} loading={data.loading} timeout={data.timeout}>
            {this.renderChildren(context, instance)}
        </SuspenseCmp>
    }
}

Suspense.prototype.timeout = 200;

class SuspenseCmp extends VDOM.Component {
    constructor(props) {
        super(props);
        this.state = {
            suspended: props.loading && props.timeout > 0
        }
    }

    componentWillReceiveProps(props) {
        if (!props.loading && this.state.suspended)
            this.setState({
                suspended: false
            })
    }

    render() {
        if (this.state.suspended)
            return null;

        return this.props.children;
    }

    componentDidMount() {
        if (this.state.suspended) {
            this.timer = setTimeout(() => {
                this.setState({suspended: false});
                this.timer = null;
            }, this.props.timeout)
        }
    }

    componentWillUnmount() {
        if (this.timer)
            clearInterval(this.timer)
    }
}
