import React, {Component} from 'react';
import Cookies from 'js-cookie';
import { Button } from 'react-chat-elements'

class Logout extends Component {
    logout() {
        Cookies.remove('username');
        Cookies.remove('token');
        window.location.reload();
    }

    render() {
        return <Button
          color='white'
          backgroundColor='#1D2D44'
          text='Logout'
          onClick={this.logout.bind(this)}
        />;
    }
}

export default Logout;
