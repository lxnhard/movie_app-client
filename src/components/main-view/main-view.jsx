import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { setMovies, setUser } from '../../actions/actions';
import MoviesList from '../movies-list/movies-list';
import { LoginView } from '../login-view/login-view';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';
import { ProfileView } from '../profile-view/profile-view';
import { GenreView } from '../genre-view/genre-view';
import { DirectorView } from '../director-view/director-view';
import { NavBar } from '../nav-bar/nav-bar';
import './main-view.scss';

class MainView extends React.Component {

  constructor() {
    super();
  }

  // after mount, fetch movies from API
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      // this.props.setUser(localStorage.getItem('user'));
      this.getMovies(accessToken);
      this.getUser(accessToken);
    }
  }

  getMovies(token) {
    axios.get('https://watch-til-death.herokuapp.com/movies', {
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
    axios.get(`https://watch-til-death.herokuapp.com/users/${user}`, {
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

              /* If there is no user, the LoginView is rendered.*/
              if (!username) {
                console.log("no user");
                return (
                  <Col xs={12} lg={8}>
                    <LoginView onLoggedIn={username => this.onLoggedIn(username)} />
                  </Col>
                );
              }

              // Before the movies have been loaded
              if (movies.length === 0) return <div className="main-view" />;

              return <MoviesList movies={movies} />;


            }} />

            {/* single Movie view component */}
            <Route path="/movies/:movieId" render={({ match, history }) => {
              /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are passed as a prop to the LoginView*/
              if (!username) return (
                <Col xs={12} lg={8}>
                  <LoginView onLoggedIn={username => this.onLoggedIn(username)} />
                </Col>
              );

              return <Col xs={12}>
                <MovieView movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
              </Col>
            }} />

            {/* Director view */}
            <Route path="/directors/:name" render={({ match, history }) => {
              /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are passed as a prop to the LoginView*/
              if (!username) return (
                <Col xs={12}>
                  <LoginView onLoggedIn={username => this.onLoggedIn(username)} />
                </Col>
              );
              if (movies.length === 0) return <div className="main-view" />;
              return <Col>
                <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} movies={movies.filter(m => m.Director.Name === match.params.name)} onBackClick={() => history.goBack()} />
              </Col>
            }
            } />

            {/* Genre view */}
            <Route path="/genres/:name" render={({ match, history }) => {
              /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are passed as a prop to the LoginView*/
              if (!username) {
                return (
                  <Col xs={12}>
                    <LoginView onLoggedIn={username => this.onLoggedIn(username)} />
                  </Col>
                );
              }

              if (movies.length === 0) return <div className="main-view" />;
              return <Col>
                <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} movies={movies.filter(m => m.Genre.Name === match.params.name)} onBackClick={() => history.goBack()} />
              </Col>
            }
            } />

            {/* Registration view */}
            <Route path="/register" render={() => {
              if (user) { return <Redirect to="/" /> }
              return <Col md={8}>
                <RegistrationView />
              </Col>
            }
            } />

            {/* User profile view */}
            <Route path={`/users/${username}`} render={({ history }) => {
              if (!username) { return <Redirect to="/" /> }
              return <Col>
                <ProfileView user={user} movies={movies} onBackClick={() => history.goBack()} />
              </Col>
            }
            } />

            {/* User profile update */}
            <Route path={`/user-update/${username}`} render={({ history }) => {
              if (!username) { return <Redirect to="/" /> }
              return <Col md={8}>
                <UserUpdate user={username} onBackClick={() => history.goBack()} />
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

export default connect(mapStateToProps, { setMovies, setUser })(MainView);