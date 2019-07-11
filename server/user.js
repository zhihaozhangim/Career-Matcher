const express = require('express')
const Router = express.Router()

// used to encode the password using md5
const utils = require('utility')

const model = require('./model')
const User = model.getModel('user')
const Chat = model.getModel('chat')

// Do not display pwd and version in console
const _filter = {'pwd': 0, '_v': 0}

Router.get('/list', function(req, res) {
    // using req.query to get the params passed by get method
    const {type} = req.query

    User.find({type}, function(err, doc) {
        return res.json({code: 0, data: doc})
    })
})

// get message list
Router.get('/getmsglist', function(req, res) {
    // get the user from cookie.
    const user = req.cookies.userid
    User.find({},function(err, userdoc) {
        // Get the name and avatar of all users and keep it in an object.
        let users = {}
        userdoc.forEach(v=>{
            users[v._id] = {name: v.user, avatar: v.avatar}
        })
        // Get all the messages come from or go to the user, then send it to
        // the front end alongside with the user information.
        Chat.find({'$or':[{from: user}, {to: user}]}, function(err, doc) {
            if (!err) {
                return res.json({code: 0, msgs: doc, users: users})
            }
        })
    })    
})

// handling read message logic
Router.post('/readmsg', function(req, res) {
    const userid = req.cookies.userid
    const {from} = req.body
    Chat.update(
        {from, to: userid}, 
        {'$set':{read: true}}, 
        // modify multi rows
        {'multi': true},
        function(err, doc) {
        if (!err) {
            // @params nModified - how many rows have been modified
            return res.json({code: 0, num: doc.nModified})
        }
        return res.json({code: 1, msg: "Fail to update"})
    })
})

// backend logic for update.
Router.post('/update', function(req, res) {
    // check cookie, handle the logic when user login an account in 
    // two windows, one has logged out, one is still trying to send
    // request.
    const userid = req.cookies.userid
    if (!userid) {
        return json.dumps({code: 1})
    }
    const body = req.body
    // body is the info used to update the user.
    User.findByIdAndUpdate(userid, body, function(err, doc){
        // merge user and type and body into data
        const data = Object.assign({}, {
            user: doc.user,
            type: doc.type
        }, body)
        return res.json({code: 0, data})
    })
})

// backend logic for login
Router.post('/login', function(req, res) {
    const {user, pwd} = req.body
    // _filter is a projection. Specifies the fields to return using projection operators. Omit this parameter 
    // to return all fields in the matching document.
    User.findOne({user, pwd: md5Pwd(pwd)}, _filter, function(err, doc) {
        if (!doc) {
            return res.json({code: 1, msg: 'Incorrect username or password'})
        }
        // set cookies for user to keep authentication state.
        res.cookie('userid', doc._id)
        return res.json({code: 0, data: doc})
    })
})

// backend logic for register
Router.post('/register', function(req, res) {
    const {user, pwd, type} = req.body

    // check whether the username already exists
    User.findOne({user: user}, function(err, doc) {
        if (doc) {
            return res.json({code: 1, msg: 'repeated username'})
        }

        // in order to get the id of the user to set cookie.
        const userModel = new User({user, type, pwd : md5Pwd(pwd)})
        userModel.save(function(e, d) {
            if (e) {
                return res.json({code: 1, msg: 'something wrong when registering a user'})
            }
            const {user, type, _id} = d 
            // set user cookie
            res.cookie("userid", _id)
            return res.json({code: 0, data: {user, type, _id}})
        })
    })
})

// used by authroute for the very first check of authentication based on user's cookie.
Router.get('/info', function(req, res) {
    // get users' cookie
    const {userid} = req.cookies
    if (!userid) {
        return res.json({code: 1})
    }
    User.findOne({_id: userid}, _filter, function(err, doc) {
        if (err) {
            return res.json({code: 1, msg: 'Unexpected mistake happened'})
        }
        if (doc) {
            return res.json({code: 0, data: doc})
        }
    })
})

// this function is used to encode the encoded password one more time.
// 2 layers of md5 + salt. 
// salt will be hidden when the application is deployed someday

function md5Pwd(pwd) {
    const salt = 'please_suprise_me_with_offer_9382x8yz6!@IUHTAJS~SH'
    return utils.md5(utils.md5(pwd + salt))
}

module.exports = Router
