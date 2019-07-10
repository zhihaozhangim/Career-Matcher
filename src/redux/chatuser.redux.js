import axios from 'axios'

// Get user list based on the roles.
// For boss, get genius list.
// For genius, get boss list.

const USER_LIST = 'USER_LIST'

// Init state to keep the list of users.
const initState = {
    userList: []
}

// Reducer of chat user.
export function chatuser(state = initState, action) {
    switch(action.type) {
        case USER_LIST:
            return {...state, userList:action.payload}
        default:
            return state
    }
}

// Action creator.
function userList(data) {
    return {type: USER_LIST, payload: data}
}

// Send request to backend to get user list.
export function getUserList(type) {
    return dispatch=>{
        axios.get('/user/list?type='+type).then(res=>{
            if (res.data.code === 0) {
                dispatch(userList(res.data.data))
            }
        })
    }
}

