import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route } from "react-router-dom";
import { useHistory } from 'react-router-dom';


import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import './main-view.scss';


export class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      movies: [],
      user: null
    }
  }


  // after mount, fetch movies from API
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  getMovies(token) {
    axios.get('https://watch-til-death.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Assign result to state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error)
      });
  }

  /* successful log in =>  update `user` property in state to that particular user*/
  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token)
  }

  /* logout */
  onLoggedOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({
      user: null
    });
  }


  render() {
    const { movies, user } = this.state;

    /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are passed as a prop to the LoginView*/
    if (!user) return (
      <Row className="justify-content-center">
        <Col xs={12} lg={8}>
          <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
        </Col>
      </Row>
    );

    // Before the movies have been loaded
    if (movies.length === 0) return <div className="main-view" />;

    return (
      <Router>

        {/* Log out button */}
        <Row>
          <Col xs={12}>
            <Button variant="secondary" type="button" className="mb-2 mt-2 float-right" onClick={() => { this.onLoggedOut(); }}>
              Log out
            </Button>
          </Col>
        </Row >

        {/* Main content */}
        <Row className="main-view justify-content-md-center">

          {/* Movie card grid component */}
          <Route exact path="/" render={() => {
            return movies.map(m => (
              <Col xs={12} md={4} lg={3} className="main-grid-item mb-3" key={m._id}>
                <MovieCard movie={m} />
              </Col>
            ))
          }} />

          {/* single Movie view component */}
          <Route path="/movies/:movieId" render={({ match }) => {
            return <Col xs={12}>
              <MovieView movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
            </Col>
          }} />

          {/* Director view */}
          <Route path="/directors/:name" render={({ match }) => {
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} />
            </Col>
          }
          } />

        </Row>
      </Router>
    );
  }
}
