import React, {Component} from 'react'
import Cookies from "js-cookie";
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

const URL = 'ws://localhost:3030';

class Chat extends Component {
    state = {
        username: Cookies.get('username'),
        messages: []
    };

    ws = Chat.createWebsocket();

    static createWebsocket() {
        return new WebSocket(URL);
    }

    componentDidMount() {
        this.ws.onopen = () => {
            console.log('Websocket server connected');

            // on connecting try to authenticate
            this.ws.send(JSON.stringify({
                type: 'authenticate',
                payload: {token: Cookies.get('token')}
            }));
        };

        this.ws.onmessage = evt => {
            // on receiving a message, add it to the list of messages
            const message = JSON.parse(evt.data);
            if (!message.error && message.message) {
                this.addMessage(message);
            }
        };

        this.ws.onclose = () => {
            console.log('Websocket server disconnected');
            // automatically try to reconnect on connection loss
            this.setState({
                ws: Chat.createWebsocket(),
            });
        }
    }

    addMessage = message => this.setState(state => ({messages: [message, ...state.messages]}));

    submitMessage = messageString => {
        // on submitting the ChatInput form, send the message, add it to the list and reset the input
        this.ws.send(JSON.stringify({
            type: 'chat',
            payload: {message: messageString}
        }));

        this.addMessage({
            username: this.state.username,
            message: messageString
        });
    };

    render() {
        return (
            <div>
                <ChatInput
                    ws={this.ws}
                    onSubmitMessage={messageString => this.submitMessage(messageString)}
                />
                {this.state.messages.map((message, index) =>
                    <ChatMessage
                        key={index}
                        username={message.username}
                        message={message.message}
                    />,
                )}
            </div>
        )
    }
}

export default Chat
