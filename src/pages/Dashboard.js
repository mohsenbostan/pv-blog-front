import React, {Component} from 'react';
import Axios from "../axios.config";

class Dashboard extends Component {

    state = {
        user: []
    };

    componentDidMount() {
        this.getUserData();
    }

    getUserData() {
        this.setState({
            user: JSON.parse(localStorage.getItem('user'))
        });
    }

    render() {
        return (
            <>
                <h2 className="text-center">{this.state.user.email}</h2>
            </>
        )
    }
}

export default Dashboard;