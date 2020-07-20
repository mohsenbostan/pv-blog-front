import React from 'react';
import logo from './logo.svg';
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
      Axios.post('auth/logout').then( res => {
          localStorage.removeItem('auth');
          localStorage.removeItem('user');
      });
    };
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                        {
                            !checkAuth()
                                ? (
                                    <li>
                                        <Link to="/login">Login</Link>
                                    </li>
                                )
                                :
                                null
                        }
                        <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>

                        {
                            checkAuth()
                                ? (
                                    <li>
                                        <button className="btn btn-danger" onClick={logOut}>Logout</button>
                                    </li>
                                )
                                :
                                null
                        }

                    </ul>
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
                    <Route path="/articles/:slug" component={Article} />

                    <Route path="/">
                        <HomePage/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
