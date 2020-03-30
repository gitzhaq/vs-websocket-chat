import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie';

class Login extends Component {
    static propTypes = {
        handleSuccess: PropTypes.func.isRequired,
    };

    state = {
        username: Cookies.get('username'),
        password: '',
        isRegistering: false
    };

    onChangeAction() {
        this.setState({isRegistering: !this.state.isRegistering})
    }

    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    };

    onSubmit = (event) => {
        event.preventDefault();
        fetch(this.state.isRegistering ? '/user/register' : '/user/login', {
            method: 'POST',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
                if (res.status === 200) {
                    res.json().then(json => {
                        Cookies.set('username', json.username);
                        Cookies.set('token', json.token);
                        this.props.handleSuccess();
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
        const currentActionText = this.state.isRegistering ? 'Register' : 'Login';
        const otherActionText = this.state.isRegistering ? 'Login' : 'Register';

        return (
            <div>
                <h1>{currentActionText} Below!</h1>
                <form onSubmit={this.onSubmit}>
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
                or:
                <button onClick={this.onChangeAction.bind(this)}>{otherActionText}</button>
            </div>
        )
    }
}

export default Login;
