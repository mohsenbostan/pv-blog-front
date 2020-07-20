import React, {Component} from 'react';
import Axios from "../axios.config";
import Swal from "sweetalert2";

class RegisterPage extends Component {

    state = {
        name: '',
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

    doRegister(e) {
        e.preventDefault();
        let formData = this.state;
        Axios.get('csrf-cookie').then(response => {
            Axios.post('auth/register', formData).then(res => {
                if (res.status === 201) {
                    Swal.fire(
                        'Registered!',
                        'welcome to our system.',
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
                            <form onSubmit={this.doRegister.bind(this)}>
                                <div className="my-3">
                                    <label>Name</label>
                                    <input type="text" onChange={this.formHandler.bind(this)} name="name"
                                           className="form-control"/>
                                    {
                                        errors.name !== null
                                            ? (
                                                <div className="text-danger">
                                                    <span>{errors.name}</span>
                                                </div>
                                            )
                                            : null
                                    }
                                </div>
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
                                <button type="submit" className="btn btn-primary">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default RegisterPage;