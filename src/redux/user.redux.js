import axios from 'axios'
import { getRedirectPath } from '../util'

// constants

const ERROR_MSG = 'ERROR_MSG'
const LOGOUT = 'LOGOUT'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const LOAD_DATA = 'LOAD_DATA'

// init state of the user
const initState = {
    // used to store the page the user should be redirected to
    redirectTo: '',
    msg:'',
    user:'',
    type:''
}

// reducer of user
export function user(state=initState, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            return {...state, msg:'', redirectTo:getRedirectPath(action.payload), ...action.payload}
        case LOAD_DATA:
            return {...state, ...action.payload}
        case ERROR_MSG:
            return {...state, isAuth:false, msg:action.msg}
        case LOGOUT:
            return {...initState, redirectTo:'/login'}
        default:
            return state
    }
}

function authSuccess(obj) {
    // filter pwd
    const {pwd, ...data} = obj
    return {type: AUTH_SUCCESS, payload: data}
}

// action creater that used to report error
function errorMsg(msg) {
    return { msg, type:ERROR_MSG }
}

export function loadData(userinfo) {

    return {type: LOAD_DATA, payload: userinfo}
}

export function logoutSubmit() {
    return {type: LOGOUT}
}

export function update(data) {
    return dispatch=>{
        axios.post('/user/update', data).then(res=>{
            if (res.status === 200 && res.data.code === 0) {
                dispatch(authSuccess(res.data.data))
            } else {
                dispatch(errorMsg(res.data.msg))
            }
        })
    }
}

// action creater that handles the login logic

export function login({user, pwd}) {
    if (!user || !pwd) {
        return errorMsg('Please input your username and password')
    }

    return dispatch=>{
        axios.post('/user/login', {user, pwd}).then(res=>{
            if (res.status === 200 && res.data.code === 0) {
                dispatch(authSuccess(res.data.data))
            } else {
                dispatch(errorMsg(res.data.msg))
            }
        })
    }
}

// action creater that handles the register logic
export function register({user, pwd, repeatpwd, type}) {
    if (!user || !pwd || !type) {
        return errorMsg('Please input your username and password')
    }
    if (pwd !== repeatpwd) {
        return errorMsg('Repeat password must be same with you password')
    }

    // redux-thunk make it possible to return a function, which is used
    // to handle async request. If without redux-thunk, action creater can
    // only return synchronized action.
    return dispatch=>{
        axios.post('/user/register', {user, pwd, type}).then(res=>{
            if (res.status === 200 && res.data.code === 0) {    // success
                dispatch(authSuccess({user, pwd, type}))
            } else {    // fail
                // back end will send back the error message
                dispatch(errorMsg(res.data.msg))
            }
        })
    }
}