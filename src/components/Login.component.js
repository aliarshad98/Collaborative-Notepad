import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './Register.component'
import FrontPage from './FrontPage.component';
import Docs from "./docs.png"
import axios from 'axios';

class Login extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: false,
            message: ''
        }
    }

    setEmail(e)
    {
        this.setState({email: e.target.value});
    }

    setPassword(e)
    {
        this.setState({password: e.target.value});
    }

    checkLogin(e)
    {
        e.preventDefault();
        if (this.state.email && this.state.password)
        {
            axios.get('http://localhost:5000/users/' + this.state.email + '/' + this.state.password)
                .then((response) => {
                    if (response.data[0])
                    {
                        this.props.setUser(response.data[0]);
                        this.setState({error: false});
                        this.props.redirect(FrontPage);
                    }
                    else
                    {
                        this.setState({error: true, message: 'Email or Password not Correct'});
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({error: true});
                })
        }
        else
        {
            this.setState({error: true, message: 'Please Enter both Fields!!'});
        }
    }


    render()
    {
        return(<div className= {'container'}>
            <div className= {'sqaure'}>
                <div className= {'text-center'}>
                    <img src= {Docs} alt= "Logo" style= {{height: '150px'}}/>
                    <h1>Google Docs Clone</h1>
                    <br></br>
                    <br></br>
                    <h3>Login Page</h3>
                </div>
                { this.state.error ?
                    <div className= {'alert alert-warning'}>
                        {this.state.message}
                    </div>
                : null}
                <br></br>
                <form>
                        <div className= {'form-group row'}>
                            <label className= {'col-sm-2 col-form-label'}>Email Address</label>
                            <div className= {'col-sm-10'}>
                                <input className= {'form-control form-control-sm'} type = {'email'} onChange = {e => this.setEmail(e)}></input>
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
                            <button type= {'submit'} className= {'btn btn-primary'} onClick= {e => this.checkLogin(e)}>Login</button>
                            &nbsp;
                            <button type= {'submit'} className= {'btn btn-default'} onClick= {()=> this.props.redirect(Register)}>Register</button>
                        </div>
                </form>
            </div>
        </div>);
    }
}

export default Login; 