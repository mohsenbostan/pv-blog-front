import React, {Component} from 'react';
import Axios from "../axios.config";
import Swal from "sweetalert2";

class RegisterPage extends Component {

    state = {
        name: '',
        email: '',
        password: '',
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
                console.log(error)
            })
        })
    }

    render() {
        return (
            <>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <form onSubmit={this.doRegister.bind(this)}>
                                <div className="my-3">
                                    <label>Name</label>
                                    <input type="text" onChange={this.formHandler.bind(this)} name="name"
                                           className="form-control"/>
                                </div>
                                <div className="my-3">
                                    <label>Email</label>
                                    <input type="text" onChange={this.formHandler.bind(this)} name="email"
                                           className="form-control"/>
                                </div>
                                <div className="my-3">
                                    <label>Password</label>
                                    <input type="password" onChange={this.formHandler.bind(this)} name="password"
                                           className="form-control"/>
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