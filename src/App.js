import React, { Suspense, lazy } from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch, Redirect } from 'react-router-dom'

import configureStore, { history } from 'store/configureStore'
import RequireAuth from 'hoc/RequireAuth'
import useDocumentHeight from 'hooks/useDocumentHeight'

import './App.less';
import 'css/app.scss';

const PageNotFound = lazy(() => import('./components/notfound'));
const Login = lazy(() => import('./components/auth/Login'));
const HomeAdmin = lazy(() => import('./components/admin/home'));

const store = configureStore()

const App = () => {
    useDocumentHeight()

    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route path="/sign-in" component={Login} />
                        <Route path="/404" component={PageNotFound} />
                        <Route path="" render={(props) => {
                            const Component = RequireAuth(props)(HomeAdmin)
                            return <Component />
                        }} />
                        <Redirect to="404" />
                    </Switch>
                </Suspense>
            </ConnectedRouter>
        </Provider>
    )
}
export default App;
