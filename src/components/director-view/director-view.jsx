import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsFillArrowLeftCircleFill } from "react-icons/bs";

import './director-view.scss';
import { MovieCard } from '../movie-card/movie-card';

export function DirectorView({ director, movies, onBackClick }) {

  console.log(director);
  console.log(typeof (onBackClick));

  return (
    <>


      <Row className="mt-3 mb-2">
        <Col xs={10}>
          <h1 className="h1-genre d-inline mr-3">{director.Name}</h1>
        </Col>
        <Col xs={2}>
          <BsFillArrowLeftCircleFill type="button" onClick={() => { onBackClick() }} className="icon-back float-right ml-auto mt-2" size={40} />
        </Col>
        <Col xs={11} md={12}>
          <span>*{director.Birth}</span>{director.Death && (<span> ✝{director.Death}</span>)}
        </Col>
      </Row>

      <Row>
        <Col lg={8} md={10}>
          <p>{director.Bio}</p>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <h2 className="h2-director">Movies by {director.Name}</h2>
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