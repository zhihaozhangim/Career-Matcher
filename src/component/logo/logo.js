import React from 'react'
import './logo.css'

// The component is used to display the logo of the app.

class Logo extends React.Component {

    render() {

        return (
            <div className="logo-container">
                <img src={require('./job.png')} alt=""/>
            </div>
        )
    }
}

export default Logo