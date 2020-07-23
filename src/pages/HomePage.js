import React, {Component} from 'react';
import Swal from 'sweetalert2';
import Axios from "../axios.config";
import {Link} from "react-router-dom";

class HomePage extends Component {
    state = {
        articles: [],
        current_page: 1,
        last_page: 0,
        editIndex: 0,
        editItem: {
            id: null,
            title: null,
            description: null,
            content: null,
            category_id: null,
        },
        comment: {
            content: null,
        }
    };

    componentDidMount() {
        let {current_page} = this.state;
        this.fetchData(current_page);
    }

    fetchData(page) {
        Axios.get(`articles?page=${page}`).then(res => {
            this.setState({
                articles: res.data.data,
                current_page: res.data.current_page,
                last_page: res.data.last_page,
            });
        });
    }

    nextPage() {
        let nextPage = this.state.current_page + 1;
        this.setState({
            current_page: nextPage
        });
        this.fetchData(nextPage);
    }

    prevPage() {
        let prevPage = this.state.current_page - 1;
        this.setState({
            current_page: prevPage
        });
        this.fetchData(prevPage);
    }

    authCheck() {
        return JSON.parse(localStorage.getItem('auth'));
    }

    deleteArticle(id) {

        this.setState({
            editIndex: 0,
            editItem: {
                id: null,
                title: null,
                description: null,
                content: null,
                category_id: null,
            }
        });

        Swal.fire({
            title: 'Warning!',
            text: 'Do you want to continue?',
            icon: 'warning',
            confirmButtonText: 'Cool',
            showCancelButton: true
        }).then((result) => {
            if (result.value) {
                Axios.delete(`articles/${id}`).then(res => {
                    if (res.status === 200) {
                        Swal.fire(
                            'Deleted!',
                            'Article has been deleted.',
                            'success'
                        )
                        this.fetchData(1);
                    }
                }).catch(error => {
                    Swal.fire(
                        'Something Is Wrong!',
                        'Article has not been deleted.',
                        'error'
                    )
                });
            }
        })

    }

    editArticle(id) {
        let article = this.state.articles.filter(item => item.id === id);
        this.setState({
            editIndex: id,
            editItem: article[0]
        })

    }

    doEdit(e) {
        e.preventDefault();

        if (this.authCheck()) {
            let formData = {
                id: this.state.editItem.id,
                title: this.state.editItem.title,
                description: this.state.editItem.description,
                content: this.state.editItem.content,
                category: this.state.editItem.category_id,
            };
            Axios.put('articles',
                formData
            ).then(res => {
                if (res.status === 200) {
                    this.setState({
                        editIndex: 0,
                        editItem: {
                            id: null,
                            title: null,
                            description: null,
                            content: null,
                            category_id: null,
                        }
                    });
                    this.fetchData(1);
                    Swal.fire(
                        'Well Done!',
                        'Article Updated Successfully.',
                        'success'
                    )
                }
            })
        }
    }

    formHandler(e) {
        let target = e.target;
        let name = target.name;
        let value = target.value;

        this.setState(prevState => {
            return {
                ...prevState,
                editItem: {
                    ...prevState.editItem,
                    [name]: value
                }
            }
        })
    }

    commentFormHandler(e) {
        let target = e.target;
        let value = target.value;

        this.setState(prevState => {
            return {
                ...prevState,
                comment: {
                    ...prevState.editItem,
                    content: value
                }
            }
        })
    }

    createComment(e, article_id) {
        e.preventDefault();

        let formData = {
            content: this.state.comment.content,
        };

        Axios.post(`articles/${article_id}/saveComment`, formData).then(res => {
            if (res.status === 201) {
                this.fetchData(1);
                Swal.fire(
                    'Well Done!',
                    'Comment Added Successfully!',
                    'success'
                );
            }
        }).catch(error => {
            Swal.fire(
                'Oops!',
                'Request failed.',
                'error'
            );
        })
    }

    deleteComment(comment_id) {
        Axios.delete(`articles/${comment_id}/deleteComment`).then(res => {
            if (res.status === 200) {
                this.fetchData(1);
                Swal.fire(
                    'Well Done!',
                    'Comment Deleted Successfully!',
                    'success'
                );
            }
        }).catch(error => {
            Swal.fire(
                'Oops!',
                'Request failed.',
                'error'
            );
        })
    }

    render() {
        let {articles, current_page, last_page, editIndex, editItem} = this.state;

        let authUser = JSON.parse(localStorage.getItem('user'));
        return (
            <>
                <div className="container">
                    <div className="row justify-content-center">
                        {
                            editIndex === 0
                                ? null
                                : (
                                    <div className="col-md-12 p-5">
                                        <form onSubmit={this.doEdit.bind(this)}>
                                            <div className="from-input">
                                                <label htmlFor="title">Title</label>
                                                <input type="text" onChange={this.formHandler.bind(this)}
                                                       className="form-control" id="title" name="title"
                                                       value={editItem.title}/>
                                            </div>
                                            <div className="from-input">
                                                <label htmlFor="description">Description</label>
                                                <input type="text" onChange={this.formHandler.bind(this)}
                                                       className="form-control" id="description" name="description"
                                                       value={editItem.description}/>
                                            </div>
                                            <div className="from-input">
                                                <label htmlFor="content">Content</label>
                                                <textarea className="form-control"
                                                          onChange={this.formHandler.bind(this)}
                                                          value={editItem.content}
                                                          name="content"
                                                          id="content"/>
                                            </div>
                                            <button className="btn btn-primary my-3" type="submit">Save
                                            </button>
                                        </form>
                                    </div>
                                )
                        }
                        <h5>{
                            current_page
                        }</h5>
                        <div className="col-md-12">
                            {
                                current_page === 1
                                    ? <button className="btn btn-primary mx-3" disabled>Prev Page</button>
                                    : <button className="btn btn-primary mx-3" onClick={this.prevPage.bind(this)}>Prev
                                        Page</button>
                            }
                            {
                                current_page === last_page
                                    ? <button className="btn btn-primary mx-3" disabled>Next Page</button>
                                    : <button className="btn btn-primary mx-3" onClick={this.nextPage.bind(this)}>Next
                                        Page</button>
                            }


                        </div>
                        {
                            articles.length > 0
                                ? articles.map(article => {
                                    return (
                                        <div className="card m-3" key={article.id}>
                                            <div className="card-body p-4">
                                                <h2>
                                                    <Link to={`/articles/${article.slug}`}>{article.title}</Link>
                                                </h2>
                                                <span
                                                    className="text-secondary font-weight-bold">{article.category.name}</span>
                                                <hr/>
                                                <p>{article.description}</p>
                                            </div>
                                            {
                                                this.authCheck()
                                                    ? (
                                                        <div>
                                                            <div className="card-footer p-4">
                                                                <button className="btn btn-danger"
                                                                        onClick={this.deleteArticle.bind(this, article.id)}>Delete
                                                                </button>
                                                                <button className="btn btn-success mx-3"
                                                                        onClick={this.editArticle.bind(this, article.id)}>Edit
                                                                </button>
                                                            </div>
                                                            <div className="row">
                                                                {
                                                                    article.comments.length <= 0 && article.length <= 0
                                                                        ? (<div>No Comments Found!</div>)
                                                                        : article.comments.map(comment => {
                                                                            return (
                                                                                <div className="col-md-12 my-3" key={comment.id}>
                                                                                    <div className="card">
                                                                                        <div className="card-body">
                                                                                            <p>{comment.content}</p>
                                                                                            <hr/>
                                                                                            {
                                                                                                comment.user_id === authUser.id
                                                                                                    ? (<button
                                                                                                        className="btn btn-danger"
                                                                                                        onClick={() => this.deleteComment(comment.id)}>Delete</button>)
                                                                                                    : null
                                                                                            }

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                }

                                                                <div className="col-md-12 my-3 p-3">
                                                                    <form onSubmit={(e) => this.createComment(e, article.id)}>
                                                                        <div className="my-3">
                                                                            <label htmlFor="content">Content</label>
                                                                            <textarea name="content"
                                                                                      onChange={this.commentFormHandler.bind(this)}
                                                                                      className="form-control" id="content"
                                                                                      cols="30"
                                                                                      rows="10"/>
                                                                        </div>
                                                                        <button type="submit"
                                                                                className="btn btn-primary">Submit
                                                                        </button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                    : null
                                            }
                                        </div>
                                    )
                                })
                                : (<h2 className="text-primary text-center">Loading...</h2>)
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default HomePage;