import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
//Import Pages Component
  import Register from './pages/register';
  import Login from './pages/login';
  import Forgot from './pages/forgot';
  import NotFound from './pages/404';
  import Private from './pages/private';
  import PrivateRoute from './components/PrivateRoute'
//Import FirebaseContextProvider
import FirebaseProvider from './components/FirebaseProvider';
//Material UI
import {CssBaseline} from '@material-ui/core';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import theme from './config/theme';
//Notistack
import {SnackbarProvider} from 'notistack';

function App() {
  return (
  <>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} autoHideDuration={5000} >
        <FirebaseProvider>
          <Router>
            <Switch>
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/forgot" component={Forgot} />
              <PrivateRoute path="/settings" component={Private} />
              <PrivateRoute path="/product" component={Private} />
              <PrivateRoute path="/transaction" component={Private} />
              <PrivateRoute path="/" exact component={Private} />
              <Route component={NotFound} />
            </Switch>
          </Router>
        </FirebaseProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </>
  );
}

export default App;
