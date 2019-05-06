import React from 'react'
import { connect } from 'react-redux'
import { NavBar } from 'antd-mobile'
import { Route, Redirect } from 'react-router-dom'
import NavLinkBar from '../navlink/navlink'
import Boss from '../../component/boss/boss'
import Genius from '../../component/genius/genius'
import User from '../../component/user/user'
import Msg from '../msg/msg'
import { getMegList, recvMsg } from '../../redux/chat.redux'
// Animation effect
import QueueAnim from 'rc-queue-anim'

@connect(
    state=>state,
    { getMegList, recvMsg }
)
class Dashboard extends React.Component {

    // In order to get the amount of unread message when entering
    // the dashboard.
    componentDidMount() {
        // only get message list for the first time
        if (!this.props.chat.chatmsg.length) {
            this.props.getMegList()
            this.props.recvMsg()
        }
    }

    render() {

        const { pathname } = this.props.location
        const user = this.props.user
        
        const navList = [
            {
                path: '/boss',
                text: 'Genius',
                icon: 'boss',
                title: 'Genius List',
                component: Boss,
                hide: user.type === 'genius'
            },

            {
                path: '/genius',
                text: 'Boss',
                icon: 'job',
                title: 'Boss List',
                component: Genius,
                hide: user.type === 'boss'
            },

            {
                path: '/msg',
                text: 'Message',
                icon: 'msg',
                title: 'Message',
                component: Msg,
            },

            {
                path: '/me',
                text: 'Me',
                icon: 'user',
                title: 'My Information',
                component: User,
            },
        ]
        // In order to user animation effect, we can only render 
        // one route. 
        const page = navList.find(v=>v.path===pathname)
        
        return page ? (
            <div>
                {/* Header */}
                <NavBar  className='fixed-header' mode='dard'>
                    { page.title }
                </NavBar>
                <div style={{marginTop:45}}>
                <QueueAnim type='scaleX' duration={800}>
                    <Route 
                        key={page.path} 
                        path={page.path}
                        component={page.component}
                    >
                    </Route>   
                </QueueAnim>
                </div>
                {/* Footer */}
                <NavLinkBar data={navList}></NavLinkBar>
            </div>
        ) : <Redirect to='/msg'></Redirect>
    }
}

export default Dashboard