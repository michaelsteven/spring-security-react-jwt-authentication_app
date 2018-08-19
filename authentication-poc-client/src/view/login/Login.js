import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {ACCESS_TOKEN} from "../../config/Config";
import {login, requestResetPassword} from "../../api/Api";
import {Modal, ModalBody, ModalHeader} from 'reactstrap';

class Login extends Component {

    state = {
        loginRequest: {
            usernameOrEmail: "",
            password: "",
            twoFACode: 0,
            rememberMe: false
        },
        showLoading: false,
        showForgotPasswordModal: false,
        forgotPasswordEmail: ""
    };

    constructor(props) {
        super(props);

        this.showForgotPasswordModal = this.showForgotPasswordModal.bind(this);
        this.updateUsernameOrEmail = this.updateUsernameOrEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.updateRememberMe = this.updateRememberMe.bind(this);
        this.updateTwoFACode = this.updateTwoFACode.bind(this);
        this.requestLogin = this.requestLogin.bind(this);
        this.updateForgotPasswordEmail = this.updateForgotPasswordEmail.bind(this);
        this.forgotPasswordSend = this.forgotPasswordSend.bind(this);
    }

    componentDidMount() {
        document.title = "Sign in";
    }

    updateUsernameOrEmail = event => {
        let req = this.state.loginRequest;
        req.usernameOrEmail = event.target.value;
        this.setState({loginRequest: req});
    };

    updatePassword = event => {
        let req = this.state.loginRequest;
        req.password = event.target.value;
        this.setState({loginRequest: req});
    };

    updateRememberMe = event => {
        let req = this.state.loginRequest;
        req.rememberMe = !req.rememberMe;
        this.setState({loginRequest: req});
    };

    updateForgotPasswordEmail = event => {
        this.setState({forgotPasswordEmail: event.target.value});
    };

    updateTwoFACode = event => {
        let req = this.state.loginRequest;
        req.twoFACode = parseInt(event.target.value, 10);
        this.setState({loginRequest: req});
    };

    requestLogin = event => {
        event.preventDefault();
        this.setState({showLoading: true});
        login(this.state.loginRequest)
            .then(res => {
                localStorage.setItem(ACCESS_TOKEN, res.accessToken);
                this.props.showAlert("You are now logged in !", "success");
                this.props.history.push("/");
            }).catch(error => {
            if (error.status === 401) {
                this.props.showAlert("Your username or password is incorrect. Please try again !", "error");
            } else if (error.message === "Two-Factor authentication is enable for your account ! Please enter the code generated by your mobile application.") {
                this.props.showAlert("Two-Factor authentication is enable for your account ! Please enter the code generated by your mobile application.", "error");
            } else if (error.message === "Invalid 2FA authentication code ! Please try again later...") {
                this.props.showAlert("Invalid 2FA authentication code ! Please try again later...", "error");
            } else {
                this.props.showAlert("Sorry! Something went wrong. Please try again!", "error");
            }
            this.setState({showLoading: false});
        });
    };

    showForgotPasswordModal() {
        this.setState({showForgotPasswordModal: !this.state.showForgotPasswordModal});
    }

    forgotPasswordSend = event => {
        event.preventDefault();

        if (this.state.forgotPasswordEmail) {
            this.setState({showLoading: true});
            requestResetPassword(this.state.forgotPasswordEmail)
                .then(res => {
                    this.props.showAlert("Your request has been accepted ! If this email address is correct, you will soon receive an email with a link to reset your password.", "success");
                    this.setState({showLoading: false});
                    this.showForgotPasswordModal();
                }).catch(error => {
                if (error.status === 401) {
                    this.props.showAlert("Your username or password is incorrect. Please try again !", "error");
                } else {
                    this.props.showAlert("Sorry! Something went wrong. Please try again!", "error");
                }
                this.setState({showLoading: false});
            });
        } else {
            this.props.showAlert("Please enter a valid email address.", "error");
        }

    };

    render() {

        if (localStorage.getItem(ACCESS_TOKEN)) {
            this.props.showAlert("You are already logged in !", "info");
            this.props.history.push("/");
            return (
                <p>Oups ! Your are already logged in !</p>
            );
        } else {
            return (
                <div className="container">
                    <div className="mx-auto">
                        {
                            this.state.showLoading
                                ?
                                <div className="card card-signin my-5">
                                    <div className="card-body">
                                        <div className="align-content-center text-center">
                                            <h5>Signing in</h5>
                                            <i className="material-icons w3-xxxlarge w3-spin align-content-center">refresh</i>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                        <form onSubmit={e => this.requestLogin(e)}>
                                            <div className="card card-signin my-5">
                                                <div className="card-body">
                                                    <h1 className="card-title text-center">Sign In</h1>
                                                    <div>
                                                        <label htmlFor="inputEmail">Email address or
                                                            username</label>
                                                        <input type="text" id="inputEmail" className="form-control"
                                                               placeholder="Email address or username" required
                                                               onChange={this.updateUsernameOrEmail}
                                                               autoComplete="on"
                                                        />
                                                    </div>

                                                    <div className="mb-4 mt-4">
                                                        <label htmlFor="inputPassword">Password</label>
                                                        <input type="password" id="inputPassword"
                                                               className="form-control"
                                                               placeholder="Password" required autoComplete="on"
                                                               onChange={this.updatePassword}
                                                        />
                                                    </div>

                                                    <div
                                                        className="mb-4 mt-4 custom-control custom-checkbox mr-sm-2">
                                                        <input type="checkbox" className="custom-control-input"
                                                               id="rememberMe"
                                                               onChange={this.updateRememberMe}
                                                        />
                                                        <label className="custom-control-label"
                                                               htmlFor="rememberMe">
                                                            Remember me
                                                        </label>
                                                    </div>

                                                    <button
                                                        className="btn btn-lg btn-primary btn-block text-uppercase mb-4"
                                                        type="submit">Sign in
                                                    </button>
                                                    <p className="text-muted">Or <Link to="/register"
                                                                                       className="text-primary">register
                                                        now
                                                        !</Link></p>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                        <form onSubmit={e => this.requestLogin(e)}>
                                            <div className="card card-signin my-5">
                                                <div className="card-body">
                                                    <h1 className="card-title text-center">Sign In <b
                                                        className="text-muted">(with Two-Factor authentication)</b>
                                                    </h1>
                                                    <div>
                                                        <label htmlFor="input2FAEmail">Email address or
                                                            username</label>
                                                        <input type="text" id="input2FAEmail"
                                                               className="form-control"
                                                               placeholder="Email address or username" required
                                                               onChange={this.updateUsernameOrEmail}
                                                               autoComplete="on"
                                                        />
                                                    </div>

                                                    <div className="mb-4 mt-4">
                                                        <label htmlFor="input2FAPassword">Password</label>
                                                        <input type="password" id="input2FAPassword"
                                                               className="form-control"
                                                               placeholder="Password" required autoComplete="on"
                                                               onChange={this.updatePassword}
                                                        />
                                                    </div>

                                                    <div className="mb-4 mt-4">
                                                        <label htmlFor="input2FACode">Two-Factor Authentication
                                                            code</label>
                                                        <input type="number" id="input2FACode"
                                                               className="form-control"
                                                               placeholder="123456" required autoComplete="on"
                                                               onChange={this.updateTwoFACode}
                                                        />
                                                    </div>

                                                    <div
                                                        className="mb-4 mt-4 custom-control custom-checkbox mr-sm-2">
                                                        <input type="checkbox" className="custom-control-input"
                                                               id="rememberMe2FA"
                                                               onChange={this.updateRememberMe}
                                                        />
                                                        <label className="custom-control-label"
                                                               htmlFor="rememberMe2FA">
                                                            Remember me
                                                        </label>
                                                    </div>

                                                    <button
                                                        className="btn btn-lg btn-primary btn-block text-uppercase mb-4"
                                                        type="submit">Sign in
                                                    </button>
                                                    <p className="text-muted">Or <Link to="/register"
                                                                                       className="text-primary">register
                                                        now
                                                        !</Link></p>
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                    <div onClick={this.showForgotPasswordModal} className="cursor-pointer">
                                        <p className="text-muted"><b>Forgot password ?</b></p>
                                    </div>
                                    <Modal isOpen={this.state.showForgotPasswordModal}
                                           toggle={this.showForgotPasswordModal}>
                                        <ModalHeader toggle={this.showForgotPasswordModal}>
                                            Forgot password
                                        </ModalHeader>
                                        <ModalBody>
                                            <p>
                                                To change your password please enter your email adress
                                            </p>
                                            <form onSubmit={e => this.forgotPasswordSend(e)}>
                                                <input type="email" autoComplete="on" className="form-control"
                                                       id="enable2FAPasswordConfirm" required
                                                       placeholder="Enter your email adress"
                                                       onChange={this.updateForgotPasswordEmail}
                                                />
                                                <button type="submit" className="btn btn-success btn-lg mt-4">Continue
                                                </button>
                                            </form>
                                        </ModalBody>
                                    </Modal>

                                </div>
                        }
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(Login);
