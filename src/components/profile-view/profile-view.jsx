import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { setUser, updateUser } from '../../actions/actions';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './profile-view.scss';

export function ProfileView({ user, movies, handleDeleteFavorite, onBackClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [usernameErr, setUsernameErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [emailErr, setEmailErr] = useState('');



  // validate input
  const validate = () => {
    // reset to avoid wrongly displaying error after previous invalid submit
    setUsernameErr(false);
    setPasswordErr(false);
    setEmailErr(false);

    let isReq = true;
    if (!username) {
      setUsernameErr('Username required.');
      isReq = false;
    } else if (username.length < 5) {
      setUsernameErr('Username must be at least 5 characters long.');
      isReq = false;
    }
    if (!password) {
      setPasswordErr('Password required.');
      isReq = false;
    } else if (password.length < 8) {
      setPasswordErr('Password must be at least 8 characters long.')
      isReq = false;
    }
    if (!email) {
      setEmailErr('E-mail required.');
      isReq = false;
    } else if (email.indexOf('@') === -1) {
      setEmailErr('Enter valid E-mail address.')
      isReq = false;
    }
    return isReq;
  }

  // update user info
  const handleUpdate = (e) => {
    e.preventDefault();
    const isReq = validate();
    let token = localStorage.getItem('token');

    // if successfully validated ...
    if (isReq) {

      /* Send a request to the server to change user data (put) */
      axios.put(`https://watch-til-death.cyclic.app/users/${user.Username}`, {
        Username: username,
        Password: password,
        Email: email,
        Birthday: birthday
      }, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          const data = response.data;
          localStorage.setItem('user', username);
          console.log(data);
          window.open('/', '_self');
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  // unregister
  const handleUnreg = () => {
    let token = localStorage.getItem('token');
    axios.delete(`https://watch-til-death.cyclic.app/users/${user.Username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.open('/register', '_self');
      })
      .catch(function (error) {
        console.log(error)
      });
  };


  return (
    <>
      <Row className="mt-1 mb-2">
        <Col xs={10} md={{ span: 6 }} lg={{ span: 4 }}>
          <h1 className="heading d-inline mr-3">Profile</h1>
        </Col>
        <Col xs={2} md={{ span: 2, offset: 4 }} lg={{ span: 2, offset: 6 }}>
          <Link to={`/`}>
            <FontAwesomeIcon icon={['fas', 'fa-circle-chevron-left']} type="button" onClick={() => { onBackClick() }} className="icon-back float-right ml-auto" size="3x" title="Back to all movies" alt="Back button" />
          </Link>
        </Col>
      </Row>


      <Row md={12} className="justify-content-md-center">
        <Col xs={12} md={8} lg={6}>
          <Form >
            <Form.Group controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder={user.Username} />
            </Form.Group>
            {/* display validation error */}
            {usernameErr && <p className="error">{usernameErr}</p>}
            <Form.Group controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength="8"
                placeholder="********" />
            </Form.Group>
            {/* display validation error */}
            {passwordErr && <p className="error">{passwordErr}</p>}
            <Form.Group controlId="formEmail">
              <Form.Label>E-mail:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder={user.Email} />
            </Form.Group>
            {/* display validation error */}
            {emailErr && <p className="error">{emailErr}</p>}
            <Form.Group controlId="formBirthday">
              <Form.Label>Date of Birth:</Form.Label>
              <Form.Control
                type="date"
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
                required />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleUpdate} className="mt-4 float-right">
              Update
            </Button>
          </Form>
          <Button variant="secondary" type="button" onClick={handleUnreg} className="mt-4 mr-4 float-right">
            Unregister
          </Button>
        </Col>

      </Row >

      <h2 className="heading mb-4 mt-4">Favorite Movies</h2>

      <Row md={{ offset: 3 }}>
        {user.FavoriteMovies && (movies.filter(m => user.FavoriteMovies.includes(m._id))).map(movie => (
          <Col xs={12} md={3} className="main-grid-item mb-3" key={movie._id}>

            <Card className="w-100">
              <Link to={`/movies/${movie._id}`}>
                <Card.Img variant="top" src={movie.ImagePath} alt={`Poster: ${movie.Title}`} title={movie.Title} className="image-link" />
              </Link>
              <Card.Body className="cardbody d-flex">

                <Card.Title><h3 className="heading card-title">{movie.Title}</h3></Card.Title>

                <div className="align-self-end ml-auto">
                  <FontAwesomeIcon icon={['fas', 'fa-star']} type="button" className="icon-star m-n2" onClick={() => handleDeleteFavorite(movie._id)} title="Remove from favorites" alt="Remove from favorites" size={"2x"} />
                </div>

              </Card.Body>
            </Card>
          </Col>
        ))}
        {!(user.FavoriteMovies.length > 0) && <Col><p>You have not added any movies to your list of favorites yet. Click the star next to a movie's title to add it to your list of favorites.</p></Col>}
      </Row>
    </>
  );
}

ProfileView.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  email: PropTypes.string,
  birthday: PropTypes.number
};

const mapStateToProps = (state) => {
  return {
    movies: state.movies,
    user: state.user
  };
};

// is this necessary / correct?
const mapDispatchToProps = (dispatch) => ({
  handleUpdate: (event) =>
    dispatch(updateUser(event)),
  handleUnreg: (event) =>
    dispatch(deleteUser(event)),
  handleDeleteFavorite: (event) =>
    dispatch(deleteFavorite(event))
});


// export default connect(mapStateToProps, mapDispatchToProps, { setUser, updateUser })(ProfileView);

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);