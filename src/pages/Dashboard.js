import React, {Component} from 'react';
import Axios from "../axios.config";
import Swal from "sweetalert2";

class Dashboard extends Component {

    state = {
        category: {
            name: null,
            errorMessage: null,
            errors: []
        },
        categories: [],

        article: {
            title: null,
            description: null,
            thumbnail: null,
            content: null,
            category: null,
            errorMessage: null,
            errors: []
        },
    };

    componentDidMount() {
        this.fetchCategories();
    }

    fetchCategories() {
        Axios.get('/categories').then(res => {
            this.setState(prevState => {
                return {
                    ...prevState,
                    categories: res.data
                }
            })
        });
    }

    categoryFormHandler(e) {
        let target = e.target;
        let value = target.value;

        this.setState(prevState => {
            return {
                ...prevState,
                category: {
                    ...prevState.category,
                    name: value,
                }
            }
        })
    }

    articleFormHandler(e) {
        let target = e.target;
        let name = target.name;
        let value = target.value;

        this.setState(prevState => {
            return {
                ...prevState,
                article: {
                    ...prevState.article,
                    [name]: value,
                }
            }
        });
    }

    createCategory(e) {
        e.preventDefault();
        let form = document.getElementById("categoryForm");
        Axios.post('categories', {name: this.state.category.name}).then(res => {
            if (res.status === 201) {
                this.fetchCategories();
                Swal.fire(
                    'Well Done!',
                    `Category Created Successfully.`,
                    'success'
                );
                form.reset();
                this.setState(prevState => {
                    return {
                        ...prevState,
                        category: {
                            name: null,
                            errorMessage: null,
                            errors: []
                        }
                    }
                });
            }
        }).catch(error => {
            if (error.response.status === 422) {
                form.reset();
                this.setState(prevState => {
                    return {
                        ...prevState,
                        category: {
                            errorMessage: error.response.data.message,
                            errors: error.response.data.errors
                        }
                    }
                });
            }
        })
    }

    createArticle(e) {
        e.preventDefault();
        let form = document.getElementById("articleForm");
        const formData = {
            title: this.state.article.title,
            description: this.state.article.description,
            content: this.state.article.content,
            category: parseInt(this.state.article.category),
        };
        Axios.post('articles', formData).then(res => {
            if (res.status === 201) {
                Swal.fire(
                    'Well Done!',
                    `Article Created Successfully.`,
                    'success'
                );
                form.reset();
                this.setState(prevState => {
                    return {
                        ...prevState,
                        article: {
                            title: null,
                            description: null,
                            content: null,
                            category: null,
                            errorMessage: null,
                            errors: []
                        }
                    }
                });
            }
        }).catch(error => {
            if (error.response.status === 422) {
                form.reset();
                this.setState(prevState => {
                    return {
                        ...prevState,
                        article: {
                            errorMessage: error.response.data.message,
                            errors: error.response.data.errors
                        }
                    }
                });
            }
        })
    }

    render() {
        let {category, categories, article} = this.state;
        return (
            <>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-header">
                                    <h3>New Category</h3>
                                </div>
                                <div className="card-body">
                                    {
                                        category.errorMessage !== null
                                            ? (
                                                <div className="alert alert-danger text-danger">
                                                    <span>{category.errorMessage}</span>
                                                </div>
                                            )
                                            : null
                                    }
                                    <form onSubmit={this.createCategory.bind(this)} id="categoryForm">
                                        <div className="my-3">
                                            <label htmlFor="name">Name:</label>
                                            <input type="text" name="name" id="name" className="form-control"
                                                   value={this.state.category.name}
                                                   onChange={this.categoryFormHandler.bind(this)}/>
                                            {
                                                category.errors.name !== null
                                                    ? (
                                                        <div className="text-danger">
                                                            <span>{category.errors.name}</span>
                                                        </div>
                                                    )
                                                    : null
                                            }
                                        </div>
                                        <button type="submit" className="btn btn-primary">Save</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">
                                    <h3>New Article</h3>
                                </div>
                                <div className="card-body">
                                    {
                                        article.errorMessage !== null
                                            ? (
                                                <div className="alert alert-danger text-danger">
                                                    <span>{article.errorMessage}</span>
                                                </div>
                                            )
                                            : null
                                    }
                                    <form onSubmit={this.createArticle.bind(this)} id="articleForm">

                                        <div className="my-3">
                                            <label htmlFor="title">Title: </label>
                                            <input onChange={this.articleFormHandler.bind(this)} type="text"
                                                   name="title" id="title" className="form-control"/>
                                            {
                                                article.errors.title !== null
                                                    ? (
                                                        <div className="text-danger">
                                                            <span>{article.errors.title}</span>
                                                        </div>
                                                    )
                                                    : null
                                            }
                                        </div>

                                        <div className="my-3">
                                            <label htmlFor="description">Description: </label>
                                            <textarea onChange={this.articleFormHandler.bind(this)} name="description"
                                                      id="description" className="form-control"/>
                                            {
                                                article.errors.description !== null
                                                    ? (
                                                        <div className="text-danger">
                                                            <span>{article.errors.description}</span>
                                                        </div>
                                                    )
                                                    : null
                                            }
                                        </div>

                                        <div className="my-3">
                                            <label htmlFor="content">Content: </label>
                                            <textarea onChange={this.articleFormHandler.bind(this)} name="content"
                                                      id="content" className="form-control"/>
                                            {
                                                article.errors.content !== null
                                                    ? (
                                                        <div className="text-danger">
                                                            <span>{article.errors.content}</span>
                                                        </div>
                                                    )
                                                    : null
                                            }
                                        </div>

                                        <div className="my-3">
                                            <label htmlFor="category">Category: </label>
                                            <select onChange={this.articleFormHandler.bind(this)} name="category"
                                                    id="category" className="form-control">
                                                <option value="">Choose One Category From This List...</option>
                                                {
                                                    categories.map(item => {
                                                        return (
                                                            <option key={item.id} value={item.id}>{item.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {
                                                article.errors.category !== null
                                                    ? (
                                                        <div className="text-danger">
                                                            <span>{article.errors.category}</span>
                                                        </div>
                                                    )
                                                    : null
                                            }
                                        </div>

                                        <button type="submit" className="btn btn-block btn-primary">Save</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Dashboard;