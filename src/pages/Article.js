import React, {Component} from 'react';
import Axios from "../axios.config";
import {Link} from "react-router-dom";

class Article extends Component {
    state = {
        article: null
    };

    componentDidMount() {
        Axios.get(`articles/${this.props.match.params.slug}/show`).then(res => {
            this.setState({
                article: res.data
            });
        })
    }

    render() {
        let {article} = this.state;
        console.log(article);
        return (
            <>
                {
                    article === null
                        ? null
                        : <div className="card m-3">
                            <div className="card-body p-4">
                                <h2>
                                    <Link to={`/articles/${article.slug}`}>{article.title}</Link>
                                </h2>
                                <span
                                    className="text-secondary font-weight-bold">{article.category.name}</span>
                                <hr/>
                                <p>{article.description}</p>
                                <br/>
                                <hr/>
                                <br/>
                                <div>{article.content}</div>
                            </div>
                        </div>
                }
            </>
        )
    }
}

export default Article