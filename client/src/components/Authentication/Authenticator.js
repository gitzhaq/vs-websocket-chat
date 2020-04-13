import React, {Component} from 'react';
import Cookies from 'js-cookie';
import Login from '../Authentication/Login'

class Authenticator extends Component {
    state = {
        authenticated: false
    };

    handleLoginSuccess(token) {
        // Handle login by set authenticated true in state
        this.setState({authenticated: true});
    }

    componentDidMount() {
        if (Cookies.get('token')) {
            // If token cookie is set, try to authenticate by server
            fetch('/user/check-auth')
                .then(res => {
                    if (res.status === 200) {
                        this.setState({authenticated: true});
                    } else if (res.status === 401) {
                        this.setState({authenticated: false});
                    } else {
                        throw Error(res.error);
                    }
                })
                .catch(console.error);
        }
    }

    render() {
        if (!this.state.authenticated) {
            return <Login handleSuccess={this.handleLoginSuccess.bind(this)}/>
        }

        return this.props.children;
    }
}

export default Authenticator;