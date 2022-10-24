import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';


import './nav-bar.scss';

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
    <Navbar collapseOnSelect expand="lg" className="colornav">
      <Container>
        <Navbar.Brand className="brand" href="/">Watch-Til-Death</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto ml-auto">
            {isLoggedIn() && (
              <Nav.Link href="/" className="nav-element">Home</Nav.Link>
            )}
            {isLoggedIn() && (
              <Nav.Link href={`/users/${user}`} className="nav-element">Profile</Nav.Link>
            )}
            {!isLoggedIn() && (
              <Nav.Link href="/register" className="nav-element">Register</Nav.Link>
            )}
            {!isLoggedIn() && (
              <Nav.Link href="/" className="nav-element">Log in</Nav.Link>
            )}
            {isLoggedIn() && (
              <Nav.Link variant="default" type="button" className="nav-logout" onClick={() => onLoggedOut()} >Log out</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar >

  )
}

let mapStateToProps = (state) => {
  return {
    user: state.user,
    movies: state.movies,
  };
};

export default connect(mapStateToProps)(NavBar);