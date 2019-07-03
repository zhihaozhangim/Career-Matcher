import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { loadData } from '../../redux/user.redux'

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
        // page, there is no need to get user information.
        const publicList = ['/login', '/register']
        const pathname = this.props.location.pathname
        if (publicList.indexOf(pathname) > -1) {
            return null
        }

        // If not in the login or register page, get the 
        // information of the user
        axios.get('/user/info').then(res=>{
            if (res.status === 200) {   // OK
                if (res.data.code === 0) {  // have login information
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