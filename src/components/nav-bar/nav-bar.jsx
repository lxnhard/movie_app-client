import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

export function NavBar({ user }) {

  /* logout */
  const onLoggedOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.open("/", "_self");
  }

  const isLoggedIn = () => {
    if (localStorage.getItem('token')) {
      return localStorage.getItem('token');
    } else {
      return false;
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Watch-Til-Death</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn() && (
              <Nav.Link href="/">Home</Nav.Link>
            )}
            {isLoggedIn() && (
              <Nav.Link href={`/users/${user}`}>Profile</Nav.Link>
            )}
            {!isLoggedIn() && (
              <Nav.Link href="/register">Register</Nav.Link>
            )}
            {!isLoggedIn() && (
              <Nav.Link href="/">Log in</Nav.Link>
            )}
            {isLoggedIn() && (
              <Button variant="secondary" type="button" className="mb-2 mt-2 float-right" onClick={() => onLoggedOut()} >Log out</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar >

  )
}