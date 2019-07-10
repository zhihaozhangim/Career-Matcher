import React from 'react'
import { connect } from 'react-redux'
import { getUserList } from '../../redux/chatuser.redux'
import UserCard from '../usercard/usercard'

// Component that display all geniuses.
@connect(
    state=>state.chatuser,
    { getUserList }
)
class Genius extends React.Component {

    componentDidMount() {
        this.props.getUserList('boss')
    }

    render() {
        return <UserCard userList={this.props.userList}></UserCard>
    }
}

export default Genius
