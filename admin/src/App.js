import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import 'App.scss';
import Login from "views/Pages/Login/Login";
import Register from "views/Pages/Register/Register";
import Page404 from "views/Pages/Page404/Page404";
import Page500 from "views/Pages/Page500/Page500";
import DefaultLayout from "containers/DefaultLayout/DefaultLayout";

class App extends Component {

  render() {
    return (
      <HashRouter>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login} />
            <Route exact path="/register" name="Register Page" component={Register} />
            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} />
            <Route path="/" name="Home" component={DefaultLayout} />
          </Switch>
      </HashRouter>
    );
  }
}

export default App;
