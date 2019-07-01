import React from 'react'
import ReactDom from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './app'

import reducers from './reducer'
import './config'
import './index.css'


// compose is used to combine functions.
const store = createStore(reducers, compose(

    // With a plain basic Redux store, you can only do simple synchronous 
    // updates by dispatching an action. Middleware extend the store's abilities,
    // and let you write async logic that interacts with the store. Thunks are the 
    // recommended middleware for basic Redux side effects logic, including complex 
    // synchronous logic that needs access to the store, and simple async logic like 
    // AJAX requests.

    applyMiddleware(thunk),

    // Use Redux Devtools

    window.devToolsExtension?window.devToolsExtension():f=>f
))

// If you call ReactDOM.hydrate() on a node that already has 
// this server-rendered markup, React will preserve it and only 
// attach event handlers, allowing you to have a very performant 
// first-load experience (just adding interactive logic, not rendering).
ReactDom.hydrate(
    (<Provider store={store}>
        <BrowserRouter>
            <App></App>
        </BrowserRouter>
    </Provider>),
    document.getElementById('root')
)