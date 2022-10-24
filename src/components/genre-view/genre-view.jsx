import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { connect } from 'react-redux';


import './genre-view.scss';
import { MovieCard } from '../movie-card/movie-card';

export function GenreView({ genre, movies, onBackClick }) {
  return (
    <>

      <Row className="mt-3 mb-2">
        <Col xs={10}>
          <h1 className="h1-genre d-inline mr-3">{genre.Name}</h1>
        </Col>
        <Col xs={2}>
          <BsFillArrowLeftCircleFill type="button" onClick={() => { onBackClick() }} className="icon-back float-right ml-auto mt-2" size={40} />
        </Col>
      </Row>

      <Row>
        <Col lg={8} md={10}>
          <p>{genre.Description}</p>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <h2 className="h2-genre">Recommended {genre.Name} movies:</h2>
        </Col>
      </Row>

      <Row>
        {movies.map(m => (
          <Col xs={12} md={4} lg={3} className="main-grid-item mb-3" key={m._id}>
            <MovieCard movie={m} />
          </Col>
        ))}
      </Row>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    movies: state.movies,
    user: state.user
  };
};

export default connect(mapStateToProps)(GenreView);