import React from 'react';
import history from './history';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import HomePage from './pages/HomePage';
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Axios from "./axios.config";
import Article from "./pages/Article";

function App() {
    let checkAuth = () => {
        return JSON.parse(localStorage.getItem('auth'));
    };
    let logOut = () => {
        Axios.post('auth/logout').then(res => {
            localStorage.removeItem('auth');
            localStorage.removeItem('user');
        });
    };
    return (
        <Router history={history}>
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark container">
                    <a className="navbar-brand" href="#">React API</a>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>

                            {
                                !checkAuth()
                                    ? (
                                        <>
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/login">Login</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/register">Register</Link>
                                            </li>
                                        </>
                                    )
                                    :
                                    null
                            }
                            {
                                checkAuth()
                                    ? (
                                        <>
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                                            </li>
                                            <li className="nav-item">
                                                <button className="btn btn-danger" onClick={logOut}>Logout</button>
                                            </li>
                                        </>
                                    )
                                    :
                                    null
                            }
                        </ul>
                    </div>
                </nav>
                <Switch>
                    <Route path="/register">
                        <RegisterPage/>
                    </Route>
                    <Route path="/login">
                        {
                            !checkAuth()
                                ? (
                                    <LoginPage/>
                                )
                                :
                                <Dashboard/>
                        }
                    </Route>
                    <Route path="/dashboard">
                        {
                            !checkAuth()
                                ? (
                                    <LoginPage/>
                                )
                                :
                                <Dashboard/>
                        }
                    </Route>
                    <Route path="/articles/:slug" component={Article}/>

                    <Route path="/">
                        <HomePage/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
