import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import axios from 'axios';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { MovieCard } from '../movie-card/movie-card';
import './profile-view.scss';

export function ProfileView({ user, movies, history }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [usernameErr, setUsernameErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [userData, setUserData] = useState({});


  useEffect(() => {
    getUser();
  }, []);


  // Fetch user data
  const getUser = () => {
    let token = localStorage.getItem('token');
    axios.get(`https://watch-til-death.herokuapp.com/users/${user}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUserData(response.data);
        setBirthday(userData.Birthday.slice(0, 10));
        setUsername(userData.Username);
        setEmail(userData.Email);
      })
      .catch(error => {
        console.log(error.response);
      });
  }


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

  // update
  const handleUpdate = (e) => {
    e.preventDefault();
    const isReq = validate();
    let token = localStorage.getItem('token');

    // if successfully validated ...
    if (isReq) {

      /* Send a request to the server for registration (post) */
      axios.put(`https://watch-til-death.herokuapp.com/users/${userData.Username}`, {
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

  const handleUnreg = () => {
    let token = localStorage.getItem('token');
    axios.delete(`https://watch-til-death.herokuapp.com/users/${userData.Username}`, {
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

      <h1 className="mb-4 mt-4">Profile</h1>
      <Row>
        <Col xs={12}>
          <Form >
            <Form.Group controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder={userData.Username} />
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
                placeholder={userData.Email} />
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
          <Button variant="secondary" type="submit" onClick={handleUnreg} className="mt-4 float-right">
            Unregister
          </Button>
        </Col>
      </Row>
      <Row md={{ span: 10 }}>
        {userData.FavoriteMovies && (movies.filter(m => userData.FavoriteMovies.includes(m._id))).map(fav => (
          <Col xs={12} md={{ span: 3, offset: 1 }} className="main-grid-item mb-3" key={fav._id}>
            <MovieCard movie={fav} />
          </Col>
        ))}
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