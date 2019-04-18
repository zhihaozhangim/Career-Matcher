import React from 'react'
import Logo from '../../component/logo/logo'
import { List, InputItem, Radio, WhiteSpace, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { register } from "../../redux/user.redux"
import Form from '../../component/form/form'

@connect(
    state=>state.user,
    { register }
)
// High order component used to inject the handleChange function
// to the component.
@Form
class Register extends React.Component {
    constructor(props) {
        super(props)
        // bind this to the function handleRegister.
        this.handleRegister = this.handleRegister.bind(this)
    }

    // default value is genius
    componentDidMount() {
        this.props.handleChange('type', 'genius')
    }

    // call the action creater to handle the state of the user
    
    handleRegister() {
        this.props.register(this.props.state)
    }


    render() {
        const RadioItem = Radio.RadioItem
        return (
            <div>
                {/* Redirect the page if the user register successfully */}
                {this.props.redirectTo ? <Redirect to={this.props.redirectTo} /> : null}

                {/* import logo component */}
                <Logo/>
                <List>
                    {/* display error message if any */}
                    {this.props.msg?<p className='error-msg'>{this.props.msg}</p> : null}
                    <InputItem
                        onChange={v=>this.props.handleChange('user', v)}
                    >
                        Username</InputItem>
                    <WhiteSpace/>
                    <InputItem
                        type='password'
                        onChange={v=>this.props.handleChange('pwd', v)}
                    >
                        Password</InputItem>
                    <WhiteSpace/>
                    <InputItem
                        type='password'
                        onChange={v=>this.props.handleChange('repeatpwd', v)}
                    >Password</InputItem>
                    <WhiteSpace/>
                    <RadioItem
                        checked={this.props.state.type==='genius'}
                        onChange={()=>this.props.handleChange('type', 'genius')}
                    >
                        Genius
                    </RadioItem>
                    <RadioItem
                        checked={this.props.state.type==='boss'}
                        onChange={()=>this.props.handleChange('type', 'boss')}
                    >
                        Boss
                    </RadioItem>
                    <WhiteSpace/>
                    <Button type='primary' onClick={this.handleRegister}>Register</Button>
                </List>
            </div>
        )
    }
}

export default Register