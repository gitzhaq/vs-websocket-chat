import React, {Component} from 'react'
import Cookies from 'js-cookie';
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import Logout from "../Authentication/Logout";

const URL = `ws://${window.location.hostname}:3030`;

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

    addMessage = message => this.setState(state => ({messages: [...state.messages, message]}));

    submitMessage = (messageString, date) => {
        // on submitting the ChatInput form, send the message, add it to the list and reset the input
        this.ws.send(JSON.stringify({
            type: 'chat',
            payload: {
                message: messageString,
                date: date
            }
        }));

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
                    <ChatInput
                      ws={this.ws}
                      onSubmitMessage={(messageString, date) => this.submitMessage(messageString, date)}
                    />
                </div>
            </div>
        )
    }
}

export default Chat
