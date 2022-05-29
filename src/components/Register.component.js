import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./Login.component"
//import FrontPage from './FrontPage.component';
import Docs from "./docs.png"
import axios from "axios";

class Register extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmpassword: '',
            error: false,
            message: ''
        }
    }

    updatefirstname(e)
    {
        this.setState({firstname: e.target.value});
    }

    updatelastname(e)
    {
        this.setState({lastname: e.target.value});
    }

    updateemail(e)
    {
        this.setState({email: e.target.value});
    }

    updatepassword(e)
    {
        this.setState({password: e.target.value});
    }

    updateconfirmpassword(e)
    {
        this.setState({confirmpassword: e.target.value});
    }

    registeruser(e)
    {
        e.preventDefault();
        if (this.state.firstname && this.state.lastname && this.state.email && this.state.password && this.state.confirmpassword)
        {
            console.log('Aa');
            if (this.state.password === this.state.confirmpassword)
            {
                const newuser = {
                    FirstName: this.state.firstname,
                    LastName: this.state.lastname,
                    EmailAddress: this.state.email,
                    Password: this.state.password
                }
                axios.post('http://localhost:5000/users/register', newuser)
                    .then( (response) => {
                        //console.log("AA");
                        console.log(response.data);
                        this.props.redirect(Login);
                    })
                    .catch((err) => {
                        console.log(err);
                        this.setState({error: true, message: 'This user already exists!!'});
                    });
            }
            else
            {
                this.setState({error: true, message: "Passwords donot Match!!"});
            }
        }
        else
        {
            this.setState({error: true, message: 'Please Enter all fields!!'});
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
                    <h3>Register Page</h3>
                </div>
                { this.state.error ?
                    <div className= {'alert alert-warning'}>
                        {this.state.message}
                    </div>
                : null}
                <br></br>
                <form>
                        <div className= {'form-group row'}>
                            <label className= {'col-sm-2 col-form-label'}>First Name</label>
                            <div className= {'col-sm-10'}>
                                <input className= {'form-control form-control-sm'} type = {'text'} onChange = {e => this.updatefirstname(e)}></input>
                            </div>
                        </div>
                        <div className= {'form-group row'}>
                            <label className= {'col-sm-2 col-form-label'}>Last Name</label>
                            <div className= {'col-sm-10'}>
                                <input className= {'form-control form-control-sm'} type = {'text'} onChange = {e => this.updatelastname(e)}></input>
                            </div>
                        </div>
                        <div className= {'form-group row'}>
                            <label className= {'col-sm-2 col-form-label'}>Email Address</label>
                            <div className= {'col-sm-10'}>
                                <input className= {'form-control form-control-sm'} type = {'email'} onChange = {e => this.updateemail(e)}></input>
                            </div>
                        </div>
                        <div className= {'form-group row'}>
                            <label className= {'col-sm-2 col-form-label'}>Password</label>
                            <div className= {'col-sm-10'}>
                                <input className= {'form-control form-control-sm'} type = {'password'} onChange = {e => this.updatepassword(e)}></input>
                            </div>
                        </div>
                        <div className= {'form-group row'}>
                            <label className= {'col-sm-2 col-form-label'}>Confirm Password</label>
                            <div className= {'col-sm-10'}>
                                <input className= {'form-control form-control-sm'} type = {'password'} onChange = {e => this.updateconfirmpassword(e)}></input>
                            </div>
                        </div>
                        <div className= {'text-center'}>
                            <button type= {'submit'} className= {'btn btn-primary'} onClick= {e => this.registeruser(e)}>Register</button>
                            &nbsp;
                            <button type= {'submit'} className= {'btn btn-default'} onClick= {()=> this.props.redirect(Login)}>Login</button>
                        </div>
                </form>
            </div>
        </div>);
    }
}

export default Register; 