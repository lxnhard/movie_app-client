import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    /* Send a request to the server for authentication */
    props.onLoggedIn(username);
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