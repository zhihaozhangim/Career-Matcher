import React from 'react'
import { connect } from 'react-redux'
import { Result, List, WhiteSpace, Modal } from'antd-mobile'
import browserCookies from 'browser-cookies'
import { logoutSubmit } from '../../redux/user.redux'
import { Redirect } from 'react-router-dom'

@connect(
    state=>state.user, 
    { logoutSubmit }
)
class User extends React.Component {

    constructor(props) {
        super(props)
        this.logout = this.logout.bind(this)
    }

    logout() {
        const alert = Modal.alert
        alert('Notice', 'Are you sure you want to Logout?', [
            { text: 'Cancel', onPress: () => console.log('cancel') },
            { text: 'Yes', onPress: () => {
                browserCookies.erase('userid')
                this.props.logoutSubmit()
            }},
        ])
    }
    
    render() {
        const props = this.props
        const Item = List.Item
        const Brief = Item.Brief
        return props.user ? (
            <div>
                
                <Result 
                    img={<img src={require(`../img/${this.props.avatar}.png`)} 
                        style={{width: 50}} alt='' />}
                    title={this.props.user}
                    message={props.type==='boss' ? props.company : null}
                />
                <List renderHeader={()=>'Brief Introduction'}>
                    <Item
                        multipleLine
                    >
                        {props.title}
                        {props.desc.split('\n').map(v=>
                        <Brief key={v}>{v}</Brief>)}
                        {props.money?<Brief>Salary: {props.money}</Brief> : null}
                        
                    </Item>
                </List>
                <WhiteSpace></WhiteSpace>
                <List>
                    <Item onClick={this.logout}>Logout</Item>
                </List>
            </div>
        ) : <Redirect to={props.redirectTo} />
    }
}

export default User