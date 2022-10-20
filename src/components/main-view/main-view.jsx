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
      this.props.setUser(localStorage.getItem('user'));
      this.getMovies(accessToken);
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

  /* successful log in =>  update `user` property in state to that particular user*/
  onLoggedIn(authData) {
    this.props.setUser(authData.user.Username);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token)
  }

  render() {
    const { movies } = this.props;
    const { user } = this.props;


    return (
      <>
        <Router>
          <NavBar user={user} />

          {/* Main content */}
          <Row className="main-view justify-content-md-center mt-3">

            {/* Movie card grid component */}
            <Route exact path="/" render={() => {

              /* If there is no user, the LoginView is rendered.*/
              if (!user) return (
                <Col xs={12} lg={8}>
                  <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                </Col>
              );

              // Before the movies have been loaded
              if (movies.length === 0) return <div className="main-view" />;

              return <MoviesList movies={movies} />;

              // return movies.map(m => (
              //   <Col xs={12} md={4} lg={3} className="main-grid-item mb-3" key={m._id}>
              //     <MovieCard movie={m} />
              //   </Col>
              // ))
            }} />

            {/* single Movie view component */}
            <Route path="/movies/:movieId" render={({ match, history }) => {
              /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are passed as a prop to the LoginView*/
              if (!user) return (
                <Col xs={12} lg={8}>
                  <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                </Col>
              );

              return <Col xs={12}>
                <MovieView movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
              </Col>
            }} />

            {/* Director view */}
            <Route path="/directors/:name" render={({ match, history }) => {
              /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are passed as a prop to the LoginView*/
              if (!user) return (
                <Col xs={12}>
                  <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
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
              if (!user) return (
                <Col xs={12}>
                  <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                </Col>
              );

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
            <Route path={`/users/${user}`} render={({ history }) => {
              if (!user) { return <Redirect to="/" /> }
              return <Col>
                <ProfileView user={user} movies={movies} onBackClick={() => history.goBack()} />
              </Col>
            }
            } />

            {/* User profile update */}
            <Route path={`/user-update/${user}`} render={({ history }) => {
              if (!user) { return <Redirect to="/" /> }
              return <Col md={8}>
                <UserUpdate user={user} onBackClick={() => history.goBack()} />
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
  return { movies: state.movies, user: state.user }
}

export default connect(mapStateToProps, { setMovies, setUser })(MainView);