import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import axios from 'axios';

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password, email, birthday);
    /* Send a request to the server for registration (post) */
    axios.post('https://watch-til-death.herokuapp.com/users', {
      username,
      password,
      email,
      birthday
    })
      .then(response => {
        this.setState({
          movies: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });

    /* Then re-route to login-view */
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
        <Form.Group controlId="formEmail">
          <Form.Label>E-mail:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Your E-mail address" />
        </Form.Group>
        <Form.Group controlId="formBirthday">
          <Form.Label>Date of Birth:</Form.Label>
          <Form.Control
            type="date"
            value={email}
            onChange={e => setBirthday(e.target.value)}
            required
            placeholder="Your date of birth" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit} className="mt-4 float-right">
          Submit
        </Button>
      </Form>

    </>
  );
}

RegistrationView.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  birthday: PropTypes.number.isRequired
};