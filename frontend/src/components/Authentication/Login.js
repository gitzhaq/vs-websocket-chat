import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Cookies from "js-cookie";

class Login extends Component {
    static propTypes = {
        handleToken: PropTypes.func.isRequired,
    };

    state = {
        username: Cookies.get('username'),
        password: ''
    };

    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    };

    onSubmit = (event) => {
        event.preventDefault();
        fetch('/user/login', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
                if (res.status === 200) {
                    res.json().then(json => {
                        Cookies.set('username', this.state.username);
                        Cookies.set('token', json.token);
                        this.props.handleToken(json.token);
                    });
                } else {
                    throw new Error(res.error);
                }
            }).catch(err => {
                console.error(err);
                alert('Error logging in please try again');
            });
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <h1>Login Below!</h1>
                <input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={this.state.username}
                    onChange={this.handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    required
                />
                <input type="submit" value="Submit"/>
            </form>
        )
    }
}

export default Login;
