import React from 'react'

// Highe-order component, which could add the handleChange function
// to every form by annotation.

export default function Form(Comp) {
    return class WrapperComp extends React.Component {
        constructor(props) {
            super(props)
            this.state = {}
            this.handleChange = this.handleChange.bind(this)
        }

        handleChange(key, val) {
            this.setState({
                [key]:val
            })
        }

        render () {
            return <Comp  handleChange={this.handleChange}  state={this.state} {...this.props}></Comp>
        }
    }
}