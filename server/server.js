// Using babel-node package to make the backend support es6
// for server side rendering

// configure .babelrc to make the backend support jsx

import express from 'express'
import bodyParser from 'body-parser'	// parse post body
import cookieParser from 'cookie-parser'	// parse cookie
import model from './model'

// fix a bug in css
import csshook from 'css-modules-require-hook/preset'
// fix a bug in img, support png images.
import assethook from 'asset-require-hook'
assethook({
	extensions: ['png']
})

// handle relative path
import path from 'path'
import userRouter from './user'

import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

// in place of BrowserRouter
import { StaticRouter } from 'react-router-dom'
import App from '../src/app'

// For SSR: react component -> div
// renderToString: above the fold, transfer the code to string
// renderToNodeStream: above the fold, transfer the code to stream, better performace (rendering while transfering to front end)
import { renderToString, renderToNodeStream } from 'react-dom/server'

// import css (and other staff) from build directory for SSR

import staticPath from '../build/asset-manifest.json'
import reducer from '../src/reducer'

const Chat = model.getModel('chat')
const app = express()

// work with express
const server = require('http').Server(app)
const io = require('socket.io')(server)

// listen on user's connection, socket is the current request, io is global.
io.on('connection', function(socket){
	// when receiving a message from the front end.
	socket.on('sendmsg', function(data) {
		const {from, to, msg} = data
		// create a unique id for two users having a chat
		const chatid = [from, to].sort().join('_')
		// only get messages related to the user.
		Chat.create({chatid, from, to, content: msg}, function(err, doc) {
			// broadcast the message
			io.emit('recvmsg', Object.assign({}, doc._doc))
		})
	})
})

// Open middleware

// used to parse the cookies
app.use(cookieParser())

// used to parse the body of post json
app.use(bodyParser.json())

// when see user prefix in url, send the request to userRouter.
app.use('/user', userRouter)

// middleware 
app.use(function(req, res, next) {
	if (req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
		return next()
	}
	const store = createStore(reducer, compose(
		applyMiddleware(thunk),
	))

	let context = {}

	// write the backbone html to the stream for above the fold rendering (using node to render the first screen not the react).

	res.write(`
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
			<meta name="theme-color" content="#000000">
			<title>React App</title>
			<link rel="stylesheet" href="/${staticPath['main.css']}">
		</head>
		<body>
			<noscript>
			You need to enable JavaScript to run this app.
			</noscript>
			<div id="root">
	`)
	const markupStream = renderToNodeStream(
		<Provider store={store}>
			<StaticRouter
				location={req.url}
				context={context}
			>
				<App></App>
			</StaticRouter>
		</Provider>
	)

	// pipe the node stream to response
	markupStream.pipe(res, {end: false})

	// when node stream is all writen, do the rest part
	markupStream.on('end', ()=>{
		res.write(`
				</div>
				<script src="/${staticPath['main.js']}"></script>
			</body>
			</html>`)
		res.end()
	})
})

// load static resource
app.use('/', express.static(path.resolve('build')))

// bind server and express for io
server.listen(9093, function() {
	console.log("Node app start at port 9093")
})