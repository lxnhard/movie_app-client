import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';

import { Link } from "react-router-dom";

import './movie-card.scss';

export class MovieCard extends React.Component {




  render() {
    const { movie } = this.props;
    return (
      <Card>
        <Link to={`/movies/${movie._id}`}>
          <Card.Img variant="top" src={movie.ImagePath} alt={`Poster: ${movie.Title}`} title={movie.Title} className="image-link" />
        </Link>
        <Card.Body>
          <Card.Title><h1 className="card-title">{movie.Title}</h1></Card.Title>
          <Card.Text>
            {movie.Description.slice(0, 255) + "..."}
          </Card.Text>
        </Card.Body>
      </Card>
    )
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    ReleaseYear: PropTypes.number.isRequired,
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Bio: PropTypes.string,
      Birth: PropTypes.number,
      Death: PropTypes.number
    }),
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Description: PropTypes.string
    }),
  }).isRequired
};