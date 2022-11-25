import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

import './login-view.scss';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameErr, setUsernameErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [isWrong, setIsWrong] = useState('');

  // validate input
  const validate = () => {
    // reset to avoid wrongly displaying error after previous invalid submit
    setUsernameErr(false);
    setPasswordErr(false);
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
    return isReq;
  }


  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const isReq = validate();
    // if successfully validated ...
    if (isReq) {
      /* Send a request to the server for authentication */
      axios.post('https://watch-til-death.cyclic.app/login', {
        Username: username,
        Password: password
      })
        .then(response => {
          const data = response.data;
          props.onLoggedIn(data);
        })
        .catch(e => {
          console.log("User doesn't exist.");
          setIsWrong(true);
        });
    }
  };

  return (
    <>
      <h1 className="heading mb-4 mt-4">Login</h1>
      <Form >
        <Form.Group controlId="formUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            placeholder="Your username" />
          {/* display validation error */}
          {usernameErr && <p className="error">{usernameErr}</p>}
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength="8"
            placeholder="Your password" />
          {/* display validation error */}
          {passwordErr && <p className="error">{passwordErr}</p>}
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit} className="btn-login mt-4 float-right">
          Submit
        </Button>
        <Link to="/register">
          <Button variant="secondary" type="button" className="btn-register mt-4 mr-4 float-right">
            Register
          </Button>
        </Link>
        <p className="error" style={{ visibility: isWrong ? 'visible' : 'hidden' }}>E-mail and/or password is incorrect.</p>
      </Form>
    </>
  );
}

LoginView.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string
}

const mapDispatchToProps = (dispatch) => ({
  handleSubmit: (event) =>
    dispatch(handleSubmit(event))
});

export default connect(null, mapDispatchToProps)(LoginView);