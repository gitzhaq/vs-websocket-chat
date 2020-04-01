import React, {Component} from 'react'
import './App.css'
import 'react-chat-elements/dist/main.css';
import Chat from './components/Chat/Chat'
import Authenticator from './components/Authentication/Authenticator'

class App extends Component {
    render() {
        return (
            <div className="App full-height">
                <Authenticator>
                    <Chat/>
                </Authenticator>
            </div>
        )
    }
}

export default App
