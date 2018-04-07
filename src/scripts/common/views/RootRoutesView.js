/**
 * Created by anchao on 2016/7/27.
 */
import {
    React,
    Route,
    Redirect,
    Switch,
    hot
} from 'common/Util'
import config from 'conf'
import Dialog from 'common/dialog/container'
import Loading from 'common/loading/container'

const { url } = config
const RootRoutesView = function () {
    return (
        <div className="containerchild">
            <Switch>
                <Route path={url.root.path} exact render={() => <Redirect to={url.login.path} />} />
                <Route path={url.login.path} component={url.login.component} />
                <Route path={url.app.root.path} component={url.app.root.component} />
                <Route component={url.notFind.component} />
            </Switch>
            <Dialog />
            <Loading />
        </div>
    )
}

export default hot(module)(RootRoutesView)
