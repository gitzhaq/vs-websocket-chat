import React, {Component} from 'react'
import './App.css'
import Chat from './components/Chat/Chat'
import Authenticator from './components/Authentication/Authenticator'
import Logout from './components/Authentication/Logout'

class App extends Component {
    render() {
        return (
            <div className="App">
                <Authenticator>
                    <Logout/>
                    <Chat/>
                </Authenticator>
            </div>
        )
    }
}

export default App
