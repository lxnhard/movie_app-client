import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { setMovies, setUser, setFavorite, deleteFavorite } from '../../actions/actions';
import MoviesList from '../movies-list/movies-list';
import { LoginView } from '../login-view/login-view';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';
import { ProfileView } from '../profile-view/profile-view';
import { GenreView } from '../genre-view/genre-view';
import { DirectorView } from '../director-view/director-view';
import { NavBar } from '../nav-bar/nav-bar';
import './main-view.scss';

import configData from "../../config.json";

class MainView extends React.Component {

  constructor() {
    super();
  }

  // after mount, fetch movies from API
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getMovies(accessToken);
      this.getUser(accessToken);
    }
  }

  getMovies(token) {
    axios.get(configData.API_URL + 'movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error)
      });
  }


  // Fetch user data
  getUser(token) {
    const user = localStorage.getItem('user');
    axios.get(configData.API_URL + `users/${user}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setUser(response.data);
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  /* successful log in =>  update `user` property in state to that particular user*/
  onLoggedIn(authData) {
    this.props.setUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token)
  }

  // delete from favorites
  handleDeleteFavorite = (movieId) => {
    const { user } = this.props;
    let token = localStorage.getItem('token');
    /* Send a request to the server to delete favorite (delete) */
    if (token !== null && user !== null) {
      axios.delete(configData.API_URL + `users/${user.Username}/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          console.log(response);
          this.props.deleteFavorite(movieId);

        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  // add to favorites
  handleAddFavorite = (movieId) => {
    const { user } = this.props;
    let token = localStorage.getItem('token');
    if (token !== null && user !== null) {
      /* Send a request to the server to add favorite (delete) */
      axios.put(configData.API_URL + `users/${user.Username}/movies/${movieId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          console.log(response);
          this.props.setFavorite(movieId);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };


  render() {
    const { movies, user } = this.props;
    const username = user.Username;

    return (
      <>
        <Router>
          <NavBar user={username} />

          {/* Main content */}
          <Row className="main-view justify-content-md-center mt-3">

            {/* Movie card grid component */}
            <Route exact path="/" render={() => {

              // Before the movies have been loaded if logged in 
              if (movies.length === 0 && localStorage.getItem('user')) return <div className="main-view" />;
              /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are passed as a prop to the LoginView*/
              if (!username) return (
                <Col xs={12}>
                  <LoginView onLoggedIn={username => this.onLoggedIn(username)} />
                </Col>
              );

              return <MoviesList movies={movies} />;


            }} />

            {/* single Movie view component */}
            <Route path="/movies/:movieId" render={({ match, history }) => {

              // Before the movies have been loaded if logged in 
              if (movies.length === 0 && localStorage.getItem('user')) return <div className="main-view" />;
              /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are passed as a prop to the LoginView*/
              if (!username) return (
                <Col xs={12}>
                  <LoginView onLoggedIn={username => this.onLoggedIn(username)} />
                </Col>
              );

              return <Col xs={12}>
                <MovieView user={user}
                  movie={movies.find(m => m._id === match.params.movieId)}
                  isFav={user.FavoriteMovies.includes(match.params.movieId)}
                  handleAddFavorite={this.handleAddFavorite}
                  handleDeleteFavorite={this.handleDeleteFavorite}
                  onBackClick={() => history.goBack()} />
              </Col>
            }} />

            {/* Director view */}
            <Route path="/directors/:name" render={({ match, history }) => {
              // Before the movies have been loaded if logged in 
              if (movies.length === 0 && localStorage.getItem('user')) return <div className="main-view" />;
              /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are passed as a prop to the LoginView*/
              if (!username) return (
                <Col xs={12}>
                  <LoginView onLoggedIn={username => this.onLoggedIn(username)} />
                </Col>
              );

              return <Col>
                <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} movies={movies.filter(m => m.Director.Name === match.params.name)} onBackClick={() => history.goBack()} />
              </Col>
            }
            } />

            {/* Genre view */}
            <Route path="/genres/:name" render={({ match, history }) => {
              // Before the movies have been loaded if logged in 
              if (movies.length === 0 && localStorage.getItem('user')) return <div className="main-view" />;
              /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are passed as a prop to the LoginView*/
              if (!username) return (
                <Col xs={12}>
                  <LoginView onLoggedIn={username => this.onLoggedIn(username)} />
                </Col>
              );

              return <Col>
                <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} movies={movies.filter(m => m.Genre.Name === match.params.name)} onBackClick={() => history.goBack()} />
              </Col>
            }
            } />

            {/* Registration view */}
            <Route path="/register" render={() => {
              if (username) { return <Redirect to="/" /> }
              return <Col md={8}>
                <RegistrationView />
              </Col>
            }
            } />

            {/* User profile view */}
            <Route path={`/users/${username}`} render={({ history }) => {
              if (!username) { return <Redirect to="/" /> }
              return <Col>
                <ProfileView
                  user={user}
                  movies={movies}
                  handleDeleteFavorite={this.handleDeleteFavorite}
                  onBackClick={() => history.goBack()} />
              </Col>
            }
            } />


          </Row>
        </Router>
      </>
    );
  }
}

let mapStateToProps = state => {
  return {
    movies: state.movies,
    user: state.user
  }
}

// export default connect(mapStateToProps, {mapDispatchToProps object with actionCreators for dispatched actions})(Component);
export default connect(mapStateToProps, { setMovies, setUser, setFavorite, deleteFavorite })(MainView);