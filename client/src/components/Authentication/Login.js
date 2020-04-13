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
        this.setState({isRegistering: !this.state.isRegistering});
    }

    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    };

    onSubmit = (event) => {
        event.preventDefault();
        // Try to register user
        fetch(this.state.isRegistering ? '/user/register' : '/user/login', {
            method: 'POST',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res.status === 200) {
                // If successful registrated set cookies and call handleSuccess()
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
            alert('Error signing in please try again');
        });
    };

    render() {
        return (
            <div>
                <div className="wrapper fadeInDown">
                    <div id="formContent">
                        <h2
                            className={`${this.state.isRegistering ? "underlineHover inactive" : "active"}`}
                            onClick={this.state.isRegistering ? this.onChangeAction.bind(this) : null}
                        >
                            Sign In
                        </h2>
                        <h2
                            className={`${!this.state.isRegistering ? "underlineHover inactive" : "active"}`}
                            onClick={!this.state.isRegistering ? this.onChangeAction.bind(this) : null}
                        >
                            Register
                        </h2>
                        <form  onSubmit={this.onSubmit}>
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
                            <input
                                type="submit"
                                className="fadeIn fourth"
                                value={`${this.state.isRegistering ? "Register" : "Sign In"}`}
                            />
                        </form>
                    </div>
                </div>
            </div>


        )
    }
}

export default Login;
