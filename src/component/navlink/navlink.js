import React from 'react'
import PropTypes from 'prop-types'
import { TabBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

// change it into a router component to get information about route like pathname.
@withRouter
@connect(
    state=>state.chat
)
class NavLinkBar extends React.Component {
    static propTypes = {
        // data passed must be an array
        data: PropTypes.array.isRequired
    }
    render() {
        // filter the data we do not want to display
        // for genius, we don't need genius,
        // for boss, we don't need boss.
        const navList = this.props.data.filter(v=>!v.hide)
        const {pathname} = this.props.location
        return (
            <TabBar>
                {/* Render the tabbar using the data passed from dashboard */}
                {navList.map(v=>(
                    <TabBar.Item
                        badge={v.path==='/msg' ? this.props.unread : 0}
                        key={v.path}
                        title={v.text}
                        icon={{uri: require(`./img/${v.icon}.png`)}}
                        selectedIcon={{uri: require(`./img/${v.icon}-active.png`)}}
                        selected={pathname===v.path}
                        onPress={()=>{
                            this.props.history.push(v.path)
                        }}
                    >

                    </TabBar.Item>
                ))}
            </TabBar>
        )
    }
}

export default NavLinkBar