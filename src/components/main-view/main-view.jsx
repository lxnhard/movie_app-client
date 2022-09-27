import React from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

import './main-view.scss';

export class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      movies: [],
      selectedMovie: null,
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

  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie
    });
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
    console.log(authData);
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
    const { movies, selectedMovie, user } = this.state;

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
      <>
        <Row>
          <Col xs={12}>
            <Button variant="secondary" type="button" className="mb-2 mt-2 float-right" onClick={() => { this.onLoggedOut(); }}>
              Log out
            </Button>
          </Col>
        </Row >
        <Row className="main-view justify-content-center">
          {selectedMovie
            /*If state of `selectedMovie` is not null: return selected Movie.*/
            ? (

              <Col xs={12}>
                <MovieView movie={selectedMovie} onBackClick={newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }} />
              </Col>

            )
            /* Else: return all movies*/
            : (
              movies.map(movie => (
                <Col xs={12} md={4} lg={3} className="main-grid-item mb-3">
                  <MovieCard key={movie._id} movie={movie} onMovieClick={(newSelectedMovie) => { this.setSelectedMovie(newSelectedMovie) }} />
                </Col>
              ))
            )
          }
        </Row>
      </>
    );
  }
}
