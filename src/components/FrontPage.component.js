import React from 'react';
//import Login from './Login.component';
import 'bootstrap/dist/css/bootstrap.min.css';
import Docs from "./docs.png";
import DocumentEditor from './DocumentEditor.component';
import axios from 'axios';

class FrontPage extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            user: this.props.getUser(),
            docs: [],
            collabdocs: [],
            collab: false,
            newdoc: false,
            id: '',
            title: '',
            password: '',
            confirmpassword: '',
            error: false,
            message: '',
        }
        this.getDocs();
        this.getCollabDocs();
    }

    setCollab(e)
    {
        e.preventDefault();
        this.setState({collab: !this.state.collab, newdoc: false, error: false});
    }
    setnewDoc(e)
    {
        e.preventDefault();
        this.setState({newdoc: !this.state.newdoc, collab: false, error: false});
    }

    setId(e)
    {
        e.preventDefault();
        this.setState({id: e.target.value});
    }

    setTitle(e)
    {
        e.preventDefault();
        this.setState({title: e.target.value});
    }

    setPassword(e)
    {
        e.preventDefault();
        this.setState({password: e.target.value});
    }

    setconfirmPassword(e)
    {
        e.preventDefault();
        this.setState({confirmpassword: e.target.value});
    }

    getDocs()
    {
        axios.get('http://localhost:5000/documents/' + this.state.user._id)
            .then((response) => {
                if (response.data)
                {
                    this.setState({docs: response.data.map(doc => doc)});
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    getCollabDocs()
    {
        axios.get('http://localhost:5000/documents/collabdocs/' + this.state.user._id)
            .then((response) => {
                if (response.data)
                {
                    this.setState({collabdocs: response.data.map(doc => doc)});
                    //console.log(this.state.collabdocs);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    addDocs(d)
    {
        this.props.setDocument(d);
        this.props.redirect(DocumentEditor);
    }

    newDoc(e)
    {
        e.preventDefault();

        if (this.state.password === this.state.confirmpassword)
        {
            const newdoc = {
                Owner: this.state.user._id,
                Title: this.state.title,
                Password: this.state.password,
            }
            axios.post('http://localhost:5000/documents/addDocument', newdoc)
                .then ((response) => {
                    //console.log(response.data);
                    this.props.setDocument(response.data);
                    this.props.redirect(DocumentEditor);
                })
                .catch ((err) => {
                    console.log(err);
                })
        }
        else
        {
            this.setState({error: true, message: 'Passwords do not Match!!'});
        }
    }

    newCollabDoc(e)
    {
        let temp = false;
        this.state.docs.forEach(e => {
            if (e._id === this.state.id)
            {
                temp = true;
            }
        });

        if (temp)
        {
            this.setState({error: true, message: 'You are already Owner of this Document!!'});
        }
        else
        {
            this.state.collabdocs.forEach(e => {
                if (e._id === this.state.id)
                {
                    temp = true;
                }
            });

            if (temp)
            {
                this.setState({error: true, message: 'You are Collaborating in this Document!!'});
            }

            else
            {
                this.setState({error: false, message: ''});
            }
        }

        if (!temp)
        {
            e.preventDefault();
            const newcollab = {
                id: this.state.id,
                password: this.state.password,
                userid: this.state.user._id,
            }
            axios.post('http://localhost:5000/documents/collaborate', newcollab)
                .then ((response) => {
                    //console.log(response.data);
                    if (response.data === 'Passwords donot match!!')
                    {
                        //console.log('Passwords dont match!!');
                        this.setState({error: true, message: 'Password not Correct!!'});
                    }
                    else
                    {
                        this.props.setDocument(response.data);
                        this.props.redirect(DocumentEditor);
                    }
                })
                .catch ((err) => {
                    console.log(err);
                    this.setState({error: true, message: 'ID not Correct'});
                })
        }
    }

    deleteDoc(e,data)
    {
        e.preventDefault();
        axios.post('http://localhost:5000/documents/deletedoc/' + data._id)
            .then((response) => {
                if (response.data)
                {
                    var temp = this.state.docs.indexOf(data);
                    console.log(temp);
                    this.state.docs.splice(temp,1);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render()
    {
        return(<div className = {'container'}>
            <div className= {'text-right'}>
                {/* <button className = {'btn btn-default'} type= {'submit'}>View Profile</button> */}
                &nbsp;
                <button className = {'btn btn-primary'} type= {'submit'} onClick= {()=> this.props.reset()}>Logout</button>
            </div>
            <br></br>
            <div className= {'text-center'}>
                <img src= {Docs} alt= "Logo" style= {{height: '150px'}}/>
                <h1>Docs</h1>
                <br></br>

                { this.state.error ?
                    <div className= {'alert alert-warning'}>
                        {this.state.message}
                    </div>
                : null}

                <button className= {'btn btn-primary'} onClick= {e => this.setnewDoc(e)}>Create a New Document</button>
                &nbsp;
                <button className= {'btn btn-default'} onClick= {e => this.setCollab(e)}>Collabortive Editing</button>
                <br></br>
                <br></br>
                { this.state.collab ?
                <form>
                    <div className= {'form-group row'}>
                        <label className= {'col-sm-2 col-form-label'}>ID</label>
                        <div className= {'col-sm-10'}>
                            <input className= {'form-control form-control-sm'} type = {'text'} onChange = {e => this.setId(e)}></input>
                        </div>
                    </div>
                    <br></br>
                    <div className= {'form-group row'}>
                        <label className= {'col-sm-2 col-form-label'}>Password</label>
                        <div className= {'col-sm-10'}>
                        <   input className= {'form-control form-control-sm'} type = {'password'} onChange = {e => this.setPassword(e)}></input>
                        </div>
                    </div>
                    <br></br>
                    <div className= {'text-center'}>
                        <button type= {'submit'} className= {'btn btn-primary'} onClick= {e => this.newCollabDoc(e)}>Collaborate</button>
                        &nbsp;
                        <button type= {'submit'} className= {'btn btn-default'} onClick= {e => this.setCollab(e)}>Cancel</button>
                    </div>
                </form>
                : null}
                
                { this.state.newdoc ?
                    <form>
                        <div className= {'form-group row'}>
                            <label className= {'col-sm-2 col-form-label'}>Title</label>
                            <div className= {'col-sm-10'}>
                                <input className= {'form-control form-control-sm'} type = {'text'} onChange = {e => this.setTitle(e)}></input>
                            </div>
                        </div>
                        <br></br>
                        <div className= {'form-group row'}>
                            <label className= {'col-sm-2 col-form-label'}>Password</label>
                            <div className= {'col-sm-10'}>
                            <   input className= {'form-control form-control-sm'} type = {'password'} placeholder={'<optional>'} onChange = {e => this.setPassword(e)}></input>
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        <div className= {'form-group row'}>
                            <label className= {'col-sm-2 col-form-label'}>Confirm Password</label>
                            <div className= {'col-sm-10'}>
                            <   input className= {'form-control form-control-sm'} type = {'password'} placeholder={'<optional>'} onChange = {e => this.setconfirmPassword(e)}></input>
                            </div>
                        </div>
                        <br></br>
                        <div className= {'text-center'}>
                            <button type= {'submit'} className= {'btn btn-primary'} onClick= {e => this.newDoc(e)}>Create</button>
                            &nbsp;
                            <button type= {'submit'} className= {'btn btn-default'} onClick= {e => this.setnewDoc(e)}>Cancel</button>
                        </div>
                    </form>
                : null}

            </div>
            <br></br>
            <h3>Your Documents</h3>
            <div className= {'list-group'}>
                {this.state.docs.map(item => (
                    <a href='#a' key={item._id} className= "list-group-item" onClick= {() => this.addDocs(item)}>{item.Title}
                    <span className= {'close'} onClick={e => this.deleteDoc(e,item)}>X</span>
                    </a>
                ))}
                {/* <a href='#a' className= "list-group-item" onClick= {()=> this.props.redirect(DocumentEditor)}>First Document
                <span className= {'close'}>X</span>
                </a> */}
            </div>

            <br></br>
            <h3>Collaboration Documents</h3>
            <div className= {'list-group'}>
                {this.state.collabdocs.map(item => (
                    <a href='#a' key={item._id} className= "list-group-item" onClick= {() => this.addDocs(item)}>{item.Title}
                    {/* <span className= {'close'}>X</span> */}
                    </a>
                ))}
                {/* <a href='#a' className= "list-group-item" onClick= {()=> this.props.redirect(DocumentEditor)}>First Document
                <span className= {'close'}>X</span>
                </a> */}
            </div>

        </div>);
    }
}

export default FrontPage;