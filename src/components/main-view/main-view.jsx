import React from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      movies: [
        { _id: 1, Title: 'Inception', Description: 'desc1...', ImagePath: 'https://m.media-amazon.com/images/I/912AErFSBHL._SY550_.jpg', Genre: { Name: 'Science Ficiton', Description: 'Genre desc1...' }, Director: { Name: 'Director1', Bio: "Bio1", Birth: "Birth1", Death: "Death1" } },
        { _id: 2, Title: 'The Shawshank Redemption', Description: 'desc2...', ImagePath: 'https://cdn.shopify.com/s/files/1/1416/8662/products/shawshank_redemption_R04_original_film_art_d6143a10-40d8-483f-be6f-76a715c3d84d_1200x.jpg?v=1644085657', Genre: { Name: 'Drama', Description: 'Genre desc2...' }, Director: { Name: 'Director2', Bio: "Bio2", Birth: "Birth2", Death: "Death2" } },
        { _id: 3, Title: 'Gladiator', Description: 'desc3...', ImagePath: 'https://cdn.shopify.com/s/files/1/1416/8662/products/gladiator_2000_original_film_art_5000x.jpg?v=1621986723', Genre: { Name: 'Action', Description: 'Genre desc3...' }, Director: { Name: 'Director3', Bio: "Bio3", Birth: "Birth3", Death: "Death3" } }
      ],
      selectedMovie: null
    }
  }

  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie
    });
  }

  render() {
    const { movies, selectedMovie } = this.state;


    if (movies.length === 0) return <div className="main-view">The list is empty</div>;

    return (
      <div className="main-view">
        {selectedMovie
          ? <MovieView movie={selectedMovie} onBackClick={newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }} />
          : movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} onMovieClick={(movie) => { this.setSelectedMovie(movie) }} />
          ))
        }
      </div>
    );
  }
}
