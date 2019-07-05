import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { loadData } from '../../redux/user.redux'

// This component is used to get user information and do
// some necessary redirect.

// Change this component into a router component, to
// use method like this.props.location.pathname.
@withRouter
@connect(
    null,
    { loadData }
)
class AuthRoute extends React.Component {

    componentDidMount() {

        // If the user is already in the login or register 
        // page, there is no need to redirect.
        const publicList = ['/login', '/register']
        // get current path name.
        const pathname = this.props.location.pathname
        if (publicList.indexOf(pathname) > -1) {
            return null
        }

        // If not in the login or register page, get the 
        // information of the user. The check is based on
        // whether the user have cookie.
        axios.get('/user/info').then(res=>{
            if (res.status === 200) {   // OK
                if (res.data.code === 0) {  // have login information of the user
                    this.props.loadData(res.data.data)  // load the data of user (set the state in redux)
                } else {    // no login information, redirect to login.
                    this.props.history.push('/login')
                }
            }
        })
    }
    render() {
        return null
    }
}

export default AuthRoute