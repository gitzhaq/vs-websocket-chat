import React, {Component} from 'react'
import './App.css'
import Chat from './components/Chat/Chat'
import Login from './components/Authentication/Login'
import Cookies from "js-cookie";

class App extends Component {
    state = {
        token: Cookies.get('token')
    };

    handleToken(token) {
        this.setState({token: token});
    }

    render() {
        let view;
        if (!this.state.token) {
            view = <Login handleToken={this.handleToken.bind(this)}/>
        } else {
            view = <Chat/>
        }

        return (
            <div className="App">
                {view}
            </div>
        )
    }
}

export default App
