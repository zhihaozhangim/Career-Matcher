import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Login from "./container/login/login"
import Register from "./container/register/register"
import AuthRoute from './component/authroute/authroute'
import BossInfo from './container/bossinfo/bossinfo'
import GeniusInfo from './container/geniusinfo/geniusinfo'
import Dashboard from './component/dashboard/dashboard'
import Chat from './component/chat/chat'

// This component can be used by front end and back end (server side rendering) 

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            hasError: false
        }
    }

    // life cycle used to catch all possible errors
    componentDidCatch(err, info) {
        this.setState({
            hasError: true
        })
    }

    render() {
        return this.state.hasError 
        ? <img src={require('./error.png')} alt="error" />
        : (
            <div>
                <AuthRoute></AuthRoute>
                {/* hit the first matched one and return */}
                <Switch>
                    {/* All the following components are route components. */}
                    <Route path='/bossinfo' component={BossInfo}></Route>
                    <Route path='/geniusinfo' component={GeniusInfo}></Route>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/register' component={Register}></Route>
                    <Route path='/chat/:user' component={Chat}></Route>
                    {/* will return this if none is hit */}
                    <Route component={Dashboard}></Route>
                </Switch>
            </div>
        )
    }
}

export default App