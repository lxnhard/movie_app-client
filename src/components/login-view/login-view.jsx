import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import axios from 'axios';


export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Send a request to the server for authentication */
    axios.post('https://watch-til-death.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log("User doesn't exist.")
      });
  };

  return (
    <>
      <h1 className="mb-4 mt-4">Login</h1>
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
        <Button variant="primary" type="submit" onClick={handleSubmit} className="mt-4 float-right">
          Submit
        </Button>
        <Button variant="secondary" type="button" className="mt-4 mr-4 float-right">
          Register
        </Button>
      </Form>
    </>
  );
}

LoginView.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string
}