import React from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'

// Message component which is used to display message.

// get all message list
@connect(
    state=>state
)
class Msg extends React.Component {

    // get the last message of every chat.
    getLast(arr) {
        return arr[arr.length - 1]
    }

    render() {
        const Item = List.Item
        const Brief = Item.Brief
        // id of current user
        const userid = this.props.user._id
        const userinfo = this.props.chat.users
        // group users by chatid
        const msgGroup = {}
        this.props.chat.chatmsg.forEach(v=>{
            msgGroup[v.chatid] = msgGroup[v.chatid] || []
            msgGroup[v.chatid].push(v)
        })

        // sort the message list by list (the first one is the latest)
        const chatList = Object.values(msgGroup).sort(((a, b)=> {
            const a_last = this.getLast(a).create_time
            const b_last = this.getLast(b).create_time
            return b_last - a_last
        }))
        return (
            <div>
                
                    {chatList.map(v=>{
                        const lastItem = this.getLast(v)
                        // If I send the message, display the name of the other user
                        const targetId = v[0].from === userid ? v[0].to : v[0].from
                        // get the number of unread message
                        const unreadNum = v.filter(v=>!v.read && v.to === userid).length
                        if (!userinfo[targetId]) {
                            return null
                        }
                        // const name = userinfo[targetId] ? userinfo[targetId].name : ''
                        // const avatar = userinfo[targetId] ? userinfo[targetId].avatar : ''
                        return (
                            <List key={lastItem._id}>
                                <Item
                                    extra={<Badge text={unreadNum}></Badge>}
                                    thumb={require(`../img/${userinfo[targetId].avatar}.png`)}
                                    arrow="horizontal"
                                    onClick={()=>{
                                        this.props.history.push(`/chat/${targetId}`)
                                    }}
                                >
                                    {lastItem.content}
                                    <Brief>{userinfo[targetId].name}</Brief>
                                </Item>
                            </List>
                        )
                    })}
                
            </div>
        )
    }
} 

export default Msg