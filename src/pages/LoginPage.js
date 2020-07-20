import React, {Component} from 'react';
import Axios from "../axios.config";
import Swal from "sweetalert2";

class LoginPage extends Component {

    state = {
        email: '',
        password: '',
        errorMessage: null,
        errors: []
    };

    formHandler(e) {
        let target = e.target;
        let name = target.name;
        let value = target.value;

        this.setState({
            [name]: value
        })
    }

    doLogin(e) {
        e.preventDefault();
        let formData = this.state;
        Axios.get('csrf-cookie').then(response => {
            Axios.post('auth/login', formData).then(res => {
                if (res.status === 200) {
                    localStorage.setItem('auth', 'true');
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    Swal.fire(
                        'Logged In!',
                        `Hello ${res.data.user.name}`,
                        'success'
                    )
                }
            }).catch(error => {
                if (error.response.status === 422) {
                    this.setState({
                        errorMessage: error.response.data.message,
                        errors: error.response.data.errors
                    });
                }
            })
        })
    }

    render() {
        let {errorMessage, errors} = this.state;

        return (
            <>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            {
                                errorMessage !== null
                                    ? (
                                        <div className="alert alert-danger text-danger">
                                            <span>{errorMessage}</span>
                                        </div>
                                    )
                                    : null
                            }
                            <form onSubmit={this.doLogin.bind(this)}>
                                <div className="my-3">
                                    <label>Email</label>
                                    <input type="text" onChange={this.formHandler.bind(this)} name="email"
                                           className="form-control"/>
                                    {
                                        errors.email !== null
                                            ? (
                                                <div className="text-danger">
                                                    <span>{errors.email}</span>
                                                </div>
                                            )
                                            : null
                                    }
                                </div>
                                <div className="my-3">
                                    <label>Password</label>
                                    <input type="password" onChange={this.formHandler.bind(this)} name="password"
                                           className="form-control"/>
                                    {
                                        errors.password !== null
                                            ? (
                                                <div className="text-danger">
                                                    <span>{errors.password}</span>
                                                </div>
                                            )
                                            : null
                                    }
                                </div>
                                <button type="submit" className="btn btn-primary">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default LoginPage;