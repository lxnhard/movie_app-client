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
      <Row className="mt-4 mb-2">
        <Col xs={12} md={1} className="d-flex align-items-center pr-0 mb-2 mb-md-0">
          <BsFillArrowLeftCircleFill type="button" onClick={() => onBackClick()} className="icon-back ml-md-auto p-0" size={30} />
        </Col>
        <Col xs={11} md={7}>
          <h1 className="h-director">{director.Name}</h1>
        </Col>
        <Col xs={11} md={{ span: 11, offset: 1 }}>
          <span>*{director.Birth}</span>{director.Death && (<span> ✝{director.Death}</span>)}
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 11, offset: 1 }}>
          <p>{director.Bio}</p>
        </Col>
      </Row>

      <Row>
        <Col md={{ span: 11, offset: 1 }}>
          <h2>Movies by {director.Name}</h2>
        </Col>
      </Row>
      <Row>
        {movies.map(m => (
          <Col xs={12} md={{ span: 3, offset: 1 }} className="main-grid-item mb-3" key={m._id}>
            <MovieCard movie={m} />
          </Col>
        ))
        }
      </Row >
    </>
  );
}