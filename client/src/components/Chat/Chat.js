import React, {Component} from 'react'
import Cookies from 'js-cookie';
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import Logout from "../Authentication/Logout";

const NODE_ENV = process.env.NODE_ENV || 'development';

class Chat extends Component {
    state = {
        username: Cookies.get('username'),
        messages: []
    };

    ws = Chat.createWebsocket();

    static getWebSocketHost() {
        // Replace http with ws to handle http/ws and https/wss
        let host = window.location.origin.replace(/^http/, 'ws');

        if (NODE_ENV !== 'production') {
            // For development purpose the WebSocket server uses port 3001
            host = `ws://${window.location.hostname}:3001`;
        }

        return host;
    }

    static createWebsocket() {
        return new WebSocket(Chat.getWebSocketHost());
    }

    componentDidMount() {
        this.ws.onopen = () => {
            console.log('Websocket server connected');

            // On connecting try to authenticate
            this.ws.send(JSON.stringify({
                type: 'authorization',
                payload: {token: Cookies.get('token')}
            }));
        };

        this.ws.onmessage = evt => {
            // On receiving a message, add it to the list of messages
            const message = JSON.parse(evt.data);
            if (!message.error && message.message) {
                this.addMessage(message);
            }
        };

        this.ws.onclose = () => {
            console.log('Websocket server disconnected');
            // Automatically try to reconnect on connection loss
            this.ws = Chat.createWebsocket();
        }
    }

    // Add message to messages array in state
    addMessage = message => this.setState(state => ({messages: [...state.messages, message]}));

    submitMessage = (messageString, date) => {
        // On submitting the ChatInput form, send the message, add it to the list and reset the input
        this.ws.send(JSON.stringify({
            type: 'chat',
            payload: {
                message: messageString,
                date: date
            }
        }));

        // Add own message to messages
        this.addMessage({
            username: this.state.username,
            message: messageString,
            date: date
        });
    };

    render() {
        return (
            <div className={'flex-col full-height'}>
                <div className={'top-navbar'}>
                    <Logout/>
                </div>
                <div className={'chat-window'}>
                    {this.state.messages.map((message, index) =>
                      <ChatMessage
                        key={index}
                        username={message.username}
                        message={message.message}
                        date={message.date}
                      />,
                    )}
                </div>
                <div className={'chat-input'}>
                    <ChatInput onSubmitMessage={(messageString, date) => this.submitMessage(messageString, date)}/>
                </div>
            </div>
        )
    }
}

export default Chat
