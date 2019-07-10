import React from 'react'
import { connect } from 'react-redux'
import { getUserList } from '../../redux/chatuser.redux'
import UserCard from '../usercard/usercard'

// Boss Component, display all geniuses.
@connect(
    state=>state.chatuser,
    { getUserList }
)
class Boss extends React.Component {

    componentDidMount() {
        // get userlist in redux charuser.redux.js
        this.props.getUserList('genius')
    }

    render() {
        return <UserCard userList={this.props.userList}></UserCard>
    }
}

export default Boss
