import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'

import { Link } from "react-router-dom";

import { BsFillArrowLeftCircleFill, BsStar, BsStarHalf, BsStarFill } from "react-icons/bs";

import './movie-view.scss';


export class MovieView extends React.Component {
  render() {
    const { movie, onBackClick } = this.props;
    return (
      <>
        <Row className="mt-4 mb-2">
          <Col xs={12} md={1} className="d-flex align-items-center pr-0 mb-2 mb-md-0">
            <BsFillArrowLeftCircleFill type="button" onClick={() => { onBackClick() }} className="icon-back ml-md-auto p-0" size={30} />
          </Col>
          <Col xs={11} md={7}>
            <h1 className="h-movie d-inline mr-4">{movie.Title}</h1>
            {/* Function still missing */}
            <span className="d-inline-flex align-items-center">
              <BsStar type="button" className="icon-star" size={30} />
            </span>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 7, offset: 1 }}>
            <div className="movie-genre">
              <span className="label font-weight-bold">Genre: </span>
              {/* <Button variant="link">Genre</Button> */}
              <Link to={`/genres/${movie.Genre.Name}`}>
                <span className="value">{movie.Genre.Name}</span>
              </Link>
            </div>

            <div className="movie-director">
              <span className="label font-weight-bold">Director: </span>
              {/* <Button variant="link" className="label font-weight-bold">Director</Button> */}
              <Link to={`/directors/${movie.Director.Name}`} >
                <span className="value">{movie.Director.Name}</span>
              </Link>
            </div>

            <div className="movie-description mb-4 mt-4">
              <span className="value">{movie.Description}</span>
            </div>
          </Col>

          <Col xs={12} md={4}>

            <div className="movie-image">
              <Image src={movie.ImagePath} alt={`Poster: ${movie.Title}`} title={movie.Title} className="image-movie float-md-right w-100" rounded fluid />
            </div>
          </Col>
        </Row>
      </>
    )
  }
}