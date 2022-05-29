import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login.component'
import Register from './components/Register.component';
import FrontPage from './components/FrontPage.component'
import DocumentEditor from './components/DocumentEditor.component';

class App extends React.Component {
  constructor()
  {
    super();
    this.state = {
      currentPage: Login,
      user: null,
      document: null
    };
  }

  updatecurrentPage(page)
  {
    this.setState ({currentPage: page});
  }

  updateuser(u)
  {
    this.setState({user: u});
  }

  updatedocument(d)
  {
    this.setState({document: d});
  }

  resetDocs()
  {
    this.setState({currentPage: Login, user: null, document: null});
  }

  getuser()
  {
    return this.state.user;
  }

  getdocument()
  {
    return this.state.document;
  }

  render()
  {
    return(<div>
      {
        this.state.currentPage === Login ?
        <Login
          redirect={page => this.updatecurrentPage(page)} 
          setUser={u => this.updateuser(u)}
        />: null
      }

      {
        this.state.currentPage === Register ?
        <Register
          redirect={page => this.updatecurrentPage(page)}
        /> :null
      }

      {
        this.state.currentPage === FrontPage ?
        <FrontPage
          redirect={page => this.updatecurrentPage(page)}
          reset={() => this.resetDocs()}
          getUser={() => this.getuser()}
          setDocument= {d => this.updatedocument(d)}
        /> :null
      }

      {
        this.state.currentPage === DocumentEditor ?
        <DocumentEditor
          redirect={page => this.updatecurrentPage(page)}
          reset={() => this.resetDocs()}
          getUser={() => this.getuser()}
          getDocument={() => this.getdocument()}
        /> :null
      }
      
    </div>);
  }
}


export default App;
