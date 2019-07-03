import React from 'react'
import { List, InputItem, WingBlank, WhiteSpace, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Logo from '../../component/logo/logo'
import Form from '../../component/form/form'
import { login } from '../../redux/user.redux'

// "transform-decorators-legacy" in package.json makes it possible
@connect(
    state=>state.user,
    { login }
)
// High order component used to inject the handleChange function
// to the component.
@Form
class Login extends React.Component {
    constructor(props) {
        super(props)

        // bind function register and handleLogin to this instance.
        this.register = this.register.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
    }

    // Redirect to register page.
    register() {
        this.props.history.push('/register')
    }

    // Call login function in redux.
    handleLogin() {
        this.props.login(this.props.state)
    }

    render() {
        return (
            <div>
                {this.props.redirectTo && this.props.redirectTo !== '/login'
                    ? <Redirect to={this.props.redirectTo} /> : null}

                {/* logo component */}
                <Logo/>
                <WingBlank>
                    <List>
                        {/* Show error meesages if there is any. */}
                        {this.props.msg?<p className='error-msg'>{this.props.msg}</p> : null}
                        
                        <InputItem
                        onChange={v=>this.props.handleChange('user', v)}
                        >Username</InputItem>
                        <WhiteSpace/>
                        <InputItem
                        type='password'
                        onChange={v=>this.props.handleChange('pwd', v)}
                        >Password</InputItem>
                    </List>
                    <Button  onClick={this.handleLogin} type='primary'>Login</Button>
                    <WhiteSpace/>
                    <Button onClick={this.register} type='primary'>Register</Button>
                </WingBlank>
            </div>
        )
    }
}

export default Login