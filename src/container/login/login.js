import React from 'react'
import Logo from '../../component/logo/logo'
import { List, InputItem, WingBlank, WhiteSpace, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Form from '../../component/form/form'
import { login } from '../../redux/user.redux'

@connect(
    state=>state.user,
    { login }
)
@Form
class Login extends React.Component {
    constructor(props) {
        super(props)
        this.register = this.register.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
    }

    register() {
        console.log(this.props)
        this.props.history.push('/register')
    }

    handleLogin() {
        this.props.login(this.props.state)
    }

    render() {
        return (
            <div>
                {this.props.redirectTo && this.props.redirectTo !== '/login'
                    ? <Redirect to={this.props.redirectTo} /> : null}
                <Logo/>
                <WingBlank>
                    <List>
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