import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';

import './movie-card.scss';

export class MovieCard extends React.Component {
  render() {
    const { movie, onMovieClick } = this.props;
    return (
      <Card>
        <Card.Img variant="top" src={movie.ImagePath} onClick={() => onMovieClick(movie)} alt={`Poster: ${movie.Title}`} title={movie.Title} className="image-link" />
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
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired
};