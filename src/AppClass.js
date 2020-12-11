import './App.css';
import React from 'react';
import PropTypes from 'prop-types';
import favorite_filled from './icons/favorite-24px-filled.svg'
import favorite_outlined from './icons/favorite-24px-outlined.svg'


function App() {
  return (
    <div className="App">
      <FilmList />
    </div>
  );
}

/**
 * Fetches the API data and then passes it down
 * to it's child for rendering (FaCC).
 */
class FetchFilms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      films: []
    };
  }

  // Seperate API calls to a different function
  componentDidMount() {
    fetch("https://swapi.dev/api/films/")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            films: result.results
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  // Function as Child Component (FaCC)
  render() {
    const { error, isLoaded, films } = this.state;
    return this.props.children({ error, isLoaded, films });
  }
}

FetchFilms.propTypes = {
  children: PropTypes.func.isRequired,
};

/**
 * Renders the result of FetchFilms' API call
 */
function FilmList() {
  return (
    <FetchFilms>
      {({ error, isLoaded, films }) => {
        // Handle error
        if (error) return <div>Error: {error.message}</div>;
        // Handle loading
        else if (!isLoaded) return <div>Loading...</div>;
        // Handle loaded
        else {
          return (
            <ul className="film-list">
              {films.map(film => (
                <Film key={film.episodeId} episodeId={film.episode_id} title={film.title}
                  director={film.director} producer={film.producer} releaseDate={film.release_date} />
              ))}
            </ul>
          );
        }
      }}
    </FetchFilms>
  )
}

/**
 * Get the Local Storage State of a film
 */
function getFilmLocalStorage(episodeId) {
  // Get local storage state
  let fav = localStorage.getItem(episodeId);

  // Create local storage state if it doesn't exist
  if (!fav) {
    localStorage.setItem(episodeId, false);
    fav = false;
  }

  // Convert to boolean
  return fav == 'true';
}

/**
 * Stateful component which renders a film list element
 * and its 'Favorite' button according to local storage state
 * and user input
 */
class Film extends React.Component {
  constructor(props) {
    super(props);

    // Get the local storage state of this film
    let fav = getFilmLocalStorage(props.episodeId);

    this.state = {
      isFavorite: fav,
    };

    this.handleFavorite = this.handleFavorite.bind(this);
  }

  handleFavorite() {
    // Toggle isFavorite in local storage
    localStorage.setItem(this.props.episodeId, !this.state.isFavorite)

    // Toggle isFavorite in state
    this.setState(state => ({
      isFavorite: !state.isFavorite
    }));
  }

  render() {
    const { isFavorite } = this.state;
    const { episodeId, title, director, producer, releaseDate } = this.props;

    return (

      <li key={episodeId} className="film">
        <p><b>Title:</b> Episode {episodeId}: {title}</p>
        <p><b>Director:</b> {director}</p>
        <p><b>Producer:</b> {producer}</p>
        <p><b>Release Date:</b> {releaseDate}</p>
        <button className="fav-btn" onClick={this.handleFavorite}>
          {isFavorite ? <img src={favorite_filled} /> : <img src={favorite_outlined} />}
        </button>
      </li>
    )
  }
}

Film.propTypes = {
  episodeId: PropTypes.number,
  title: PropTypes.string,
  director: PropTypes.string,
  producer: PropTypes.string,
  releaseDate: PropTypes.string,
}

export default App;
