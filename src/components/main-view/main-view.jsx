import React from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
    axios.get('https://watch-til-death.herokuapp.com/movies')
      .then(response => {
        this.setState({
          movies: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie
    });
  }

  /* successful log in =>  update `user` property in state to that particular user*/
  onLoggedIn(user) {
    this.setState({
      user: user
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
    );
  }
}
