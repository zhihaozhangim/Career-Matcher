import React from 'react'
import { List, InputItem, NavBar, Icon, Grid } from 'antd-mobile'

import { connect } from 'react-redux'
import { getMegList, sendMsg, recvMsg, readMsg } from '../../redux/chat.redux'
import { getChatId } from '../../util'
import QueueAnim from 'rc-queue-anim'


@connect(
    state=>state,
    { getMegList, sendMsg, recvMsg, readMsg }
)
class Chat extends React.Component {
    constructor(props) {
        super(props)
        // msg is a list of message
        this.state={text: '', msg:[]}
    }

    // used to fix a bug in ant design
    fixCarousel() {
        setTimeout(function(){
            window.dispatchEvent(new Event('resize'))
        }, 0)
    }

    // if already get message from redux, do not need to get
    // again. Otherwise, we need to get the message.
    componentDidMount() {
        if (!this.props.chat.chatmsg.length) {
            this.props.getMegList()
            this.props.recvMsg()
        } 
    }


    componentWillUnmount() {
        // mark all the messages with a user to read when 
        // entering into the chat
        const to = this.props.match.params.user
        this.props.readMsg(to)
    }

    
    // Send data to backend
    handleSubmit() {
        const from = this.props.user._id
        const to = this.props.match.params.user
        const msg = this.state.text
        this.props.sendMsg({from, to, msg})
        this.setState({
            text: '',
            showEmoji: false
        })
    }

    render() {
        const emoji = '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 🙄 🤔 😬 🤐 😷 🤒 🤕 😈 👿 👹 👺 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 👐 🙌 👏 🙏 👍 👎 👊 ✊ 🤘 👌 👈 👉 👆 👇 ✋  🖐 🖖 👋  💪 🖕 ✍️  💅 🖖 💄 💋 👄 👅 👂 👃 👁 👀 '
										.split(' ')
										.filter(v=>v)
										.map(v=>({text:v}))
        const userid = this.props.match.params.user
        const Item = List.Item
        const users = this.props.chat.users

        // if user not exist, just return without doing anything.
        if (!users[userid]) {
            return null
        }
        const chatid = getChatId(userid, this.props.user._id)
        // Get only the chat message which belongs to the two users.
        const chatmsgs = this.props.chat.chatmsg.filter(v=>v.chatid===chatid)
        return (
            // display user name
            <div id='chat-page'>
                <NavBar 
                    mode='dark'
                    icon={<Icon type="left" />}
                    onLeftClick={()=>{
                        this.props.history.goBack()
                    }}
                >
                    {users[userid].name}
                    
                </NavBar>
                <QueueAnim delay={100}>
                    {chatmsgs.map(v=>{
                        const avatar = require(`../img/${users[v.from].avatar}.png`)
                        return v.from===userid? (
                            <List key={v._id}>
                                <Item
                                    thumb={avatar}
                                >{v.content}</Item>
                            </List>
                            
                        ) : (
                            <List key={v._id}>
                                <Item 
                                extra={<img src={avatar} alt=''/>}
                                className='chat-me'
                                >{v.content}
                                </Item>
                            </List>
                        )
                    })}
                    </QueueAnim>

                <div className="stick-footer">
                <List>
                    <InputItem
                        placeholder='Input your message'
                        value={this.state.text}
                        onChange={v=>{
                            this.setState({text: v})
                        }}
                        extra={
                            <div>
                                <span
                                    style={{marginRight: 15}}
                                    onClick={()=>{
                                        this.setState({
                                            showEmoji: !this.state.showEmoji
                                        })
                                        this.fixCarousel()
                                    }}
                                    >😀</span>
                                <span onClick={()=>this.handleSubmit()}>Send</span>
                            </div>
                        }
                    >
                    </InputItem>
                </List>
                {this.state.showEmoji ? 
                    <Grid 
                        data={emoji}
                        columnNum={9}
                        carouselMaxRow={4}
                        isCarousel={true}
                        onClick={el=>{
                            this.setState({
                                text: this.state.text + el.text
                            })
                        }}
                    /> : null
                }
                
            </div>

            </div>
        )
    }
}

export default Chat