import React, {Component} from 'react';
import Cookies from 'js-cookie';

class Logout extends Component {
    logout() {
        Cookies.remove('username');
        Cookies.remove('token');
        window.location.reload();
    }

    render() {
        return <button onClick={this.logout.bind(this)}>Logout</button>;
    }
}

export default Logout;