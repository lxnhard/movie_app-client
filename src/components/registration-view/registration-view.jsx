import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import axios from 'axios';

import './registration-view.scss';

export function RegistrationView(props) {
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

  // submit
  const handleRegister = (e) => {
    e.preventDefault();
    const isReq = validate();

    // if successfully validated ...
    if (isReq) {
      /* Send a request to the server for registration (post) */
      axios.post('https://watch-til-death.herokuapp.com/users', {
        Username: username,
        Password: password,
        Email: email,
        Birthday: birthday
      })
        .then(response => {
          const data = response.data;
          console.log(data);
          window.open('/', '_self');
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <h1 className="mb-4 mt-4">Register</h1>
      <Form >
        <Form.Group controlId="formUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            placeholder="Your username" />
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
            placeholder="Your password" />
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
            placeholder="Your E-mail address" />
        </Form.Group>
        {/* display validation error */}
        {emailErr && <p className="error">{emailErr}</p>}
        <Form.Group controlId="formBirthday">
          <Form.Label>Date of Birth:</Form.Label>
          <Form.Control
            type="date"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            placeholder="Your date of birth" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleRegister} className="mt-4 float-right">
          Submit
        </Button>
      </Form>

    </>
  );
}

RegistrationView.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  email: PropTypes.string,
  birthday: PropTypes.number
};