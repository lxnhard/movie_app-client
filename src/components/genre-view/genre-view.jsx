import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsFillArrowLeftCircleFill } from "react-icons/bs";

import './genre-view.scss';
import { MovieCard } from '../movie-card/movie-card';

export function GenreView({ genre, movies, onBackClick }) {

  return (
    <>
      <Row className="mt-4 mb-2">
        <Col xs={12} md={1} className="d-flex align-items-center pr-0 mb-2 mb-md-0">
          <BsFillArrowLeftCircleFill type="button" onClick={() => onBackClick()} className="icon-back ml-md-auto p-0" size={30} />
        </Col>
        <Col xs={11} md={7}>
          <h1>{genre.Name}</h1>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 11, offset: 1 }}>
          <p>{genre.Description}</p>
        </Col>
      </Row>

      <Row>
        <Col md={{ span: 11, offset: 1 }}>
          <h2>{genre.Name} movies:</h2>
        </Col>
      </Row>

      <Row md={{ span: 10 }}>
        {movies.map(m => (
          <Col xs={12} md={{ span: 3, offset: 1 }} className="main-grid-item mb-3" key={m._id}>
            <MovieCard movie={m} />
          </Col>
        ))}
      </Row>
    </>
  );
}