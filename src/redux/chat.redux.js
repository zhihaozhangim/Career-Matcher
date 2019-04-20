import axios from 'axios'
import io from 'socket.io-client'
const socket = io('ws://localhost:9093') 

// get chat list
const MSG_LIST = 'MSG_LIST'

// receive messgae
const MSG_RECV = 'MSG_RECV'

// mark message as read
const MSG_READ = 'MSG_READ'

const initState = {
    chatmsg:[],
    users: {},
    unread:0
}

// reducer
export function chat(state=initState, action) {
    switch(action.type) {
        case MSG_LIST:
            return {...state, users: action.payload.users, chatmsg: action.payload.msgs, unread: action.payload.msgs.filter(v=>!v.read && v.to===action.payload.userid).length}
        case MSG_RECV:
            const n = action.payload.to === action.userid ? 1 : 0
            return {...state, chatmsg:[...state.chatmsg, action.payload], unread: state.unread + n}
        case MSG_READ:
            const {from, num} = action.payload 
            return {...state, chatmsg: state.chatmsg.map(v=>({
                ...v, read: from === v.from ? true : v.read
            })
            ), unread: state.unread - num}
        default:
            return state
    }
}

// action creator
function msgList(msgs, users, userid) {
    return {type: MSG_LIST, payload: {msgs, users, userid}}
}

function msgRecv(msg, userid) {
    return {userid, type: MSG_RECV, payload: msg}
}

function msgRead({from, userid, num}) {
    return {type: MSG_READ, payload:{from, userid, num}}
}

export function readMsg(from) {
    return (dispatch, getState)=> {
        axios.post('/user/readmsg', {from}).then(res=>{
            const userid = getState().user._id
            if (res.status === 200 && res.data.code === 0) {
                dispatch(msgRead({userid, from, num: res.data.num}))
            }
        })
    }
}

// action creator that sends a message to the backend
export function sendMsg({from, to, msg}) {
    return dispatch=>{
        socket.emit('sendmsg', {from, to, msg})
    }    
}

// action creator that handles the logic of receiving for a user. 
export function recvMsg() {
    return (dispatch, getState) =>{
        socket.on('recvmsg', function(data) {
            console.log('recvmsg', data)
            const userid = getState().user._id
            dispatch(msgRecv(data, userid))
        })
    }
}

// get message list when entering the chat
export function getMegList() {
    return (dispatch, getState)=>{
        axios.get('/user/getmsglist').then(res=>{
            if (res.status === 200 && res.data.code === 0) {
                const userid = getState().user._id
                dispatch(msgList(res.data.msgs, res.data.users, userid))
            }
        })
    }
}


