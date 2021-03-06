import './App.css';
import React, { useState, useEffect } from 'react';
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
function FetchFilms(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [films, setFilms] = useState([]);

  // On mount
  useEffect(() => {
    fetch("https://swapi.dev/api/films/")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setFilms(result.results)
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, []);

  // Function as Child Component (FaCC)
  return props.children({ error, isLoaded, films });
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

  // Convert string to boolean
  return fav == 'true';
}

/**
 * Stateful component which renders a film list element
 * and its 'Favorite' button according to local storage state
 * and user input
 */
function Film(props) {
  // Get the local storage state of this film
  let fav = getFilmLocalStorage(props.episodeId);
  const [isFavorite, setIsFavorite] = useState(fav);

  function handleFavorite() {
    // Toggle isFavorite in local storage
    localStorage.setItem(props.episodeId, !isFavorite)

    // Toggle isFavorite in state
    setIsFavorite(isFavorite => !isFavorite);
  }


  const { episodeId, title, director, producer, releaseDate } = props;

  return (
    <li key={episodeId} className="film">
      <p><b>Title:</b> Episode {episodeId}: {title}</p>
      <p><b>Director:</b> {director}</p>
      <p><b>Producer:</b> {producer}</p>
      <p><b>Release Date:</b> {releaseDate}</p>
      <button className="fav-btn" onClick={handleFavorite}>
        {isFavorite ? <img src={favorite_filled} /> : <img src={favorite_outlined} />}
      </button>
    </li>
  )

}

Film.propTypes = {
  episodeId: PropTypes.number,
  title: PropTypes.string,
  director: PropTypes.string,
  producer: PropTypes.string,
  releaseDate: PropTypes.string,
}

export default App;
