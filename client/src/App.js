import React, {Component} from 'react'
import './App.css'
import 'react-chat-elements/dist/main.css';
import Chat from './components/Chat/Chat'
import Authenticator from './components/Authentication/Authenticator'
import { Helmet } from "react-helmet";

class App extends Component {
    render() {
        return (
            <div className="App full-height">
                <Helmet>
                    <title>VS-Websocket-Chat</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                </Helmet>
                <Authenticator>
                    <Chat/>
                </Authenticator>
            </div>
        )
    }
}

export default App
