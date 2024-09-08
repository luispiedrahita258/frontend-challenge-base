'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './Movies.module.css';

interface Movie {
  id: string;
  title: string;
  poster_path: string;
  vote_average: number;
}

export default function Movies(): JSX.Element {
  const { data: session } = useSession();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genreFilter, setGenreFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [languageFilter, setLanguageFilter] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');


  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);


  const fetchMovies = async (page: number, isLoadMore: boolean = false): Promise<void> => {
    try {
      setIsLoading(true);
      const genreParam = genreFilter ? `&with_genres=${genreFilter}` : '';
      const yearParam = yearFilter ? `&primary_release_year=${yearFilter}` : '';
      const languageParam = languageFilter
        ? `&with_original_language=${languageFilter}`
        : '';
      const countryParam = countryFilter ? `&region=${countryFilter}` : '';
      const typeParam = typeFilter ? `&with_type=${typeFilter}` : '';

      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchQuery}&page=${page}${genreParam}${yearParam}${languageParam}${countryParam}${typeParam}`,
      );

      if (isLoadMore) {
        setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
      } else {
        setMovies(response.data.results);
      }

      setTotalPages(response.data.total_pages);
      setIsLoading(false);
      setError('');
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError(
        'Lo sentimos, no pudimos cargar las películas. Inténtalo de nuevo más tarde.',
      );
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchMovies(currentPage);
  }, [
    currentPage,
    searchQuery,
    genreFilter,
    yearFilter,
    languageFilter,
    countryFilter,
    typeFilter,
  ]);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };


  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setGenreFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setYearFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setLanguageFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setCountryFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setTypeFilter(event.target.value);
    setCurrentPage(1);
  };


  const loadMoreMovies = (): void => {
    const currentScrollPosition = window.scrollY;

    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchMovies(currentPage + 1, true);

      setTimeout(() => {
        window.scrollTo(0, currentScrollPosition);
      }, 100);
    }
  };


  const toggleFavorite = (movieId: string): void => {
    if (favorites.includes(movieId)) {
      setFavorites(favorites.filter((id) => id !== movieId));
    } else {
      setFavorites([...favorites, movieId]);
    }
  };

  return (
    <div className={styles.container}>
      <header>
        <h2>Películas Populares</h2>

        {/* Botón de login/logout */}
        {session ? (
          <div>
            <p>Bienvenido, {session.user?.name}!</p>
            <button className={styles.authButton} onClick={() => signIn()}>
              Iniciar sesión
            </button>
          </div>
        ) : (
          <button className={styles.authButton} onClick={() => signOut()}>
            Cerrar sesión
          </button>
        )}
      </header>

      <input
        type="text"
        placeholder="Buscar una película..."
        value={searchQuery}
        onChange={handleSearch}
        className={styles.searchBar}
      />

      <div className={styles.filtersContainer}>
        <div className={styles.filterItem}>
          <label>Filtrar por Género:</label>
          <select
            className={styles.selectInput}
            value={genreFilter}
            onChange={handleGenreChange}
          >
            <option value="">Todos los Géneros</option>
            <option value="28">Acción</option>
            <option value="35">Comedia</option>
            <option value="18">Drama</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label>Filtrar por Año:</label>
          <select
            className={styles.selectInput}
            value={yearFilter}
            onChange={handleYearChange}
          >
            <option value="">Todos los Años</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label>Filtrar por Idioma:</label>
          <select
            className={styles.selectInput}
            value={languageFilter}
            onChange={handleLanguageChange}
          >
            <option value="">Todos los Idiomas</option>
            <option value="en">Inglés</option>
            <option value="es">Español</option>
            <option value="fr">Francés</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label>Filtrar por País:</label>
          <select
            className={styles.selectInput}
            value={countryFilter}
            onChange={handleCountryChange}
          >
            <option value="">Todos los Países</option>
            <option value="US">EE.UU.</option>
            <option value="FR">Francia</option>
            <option value="ES">España</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label>Filtrar por Tipo:</label>
          <select
            className={styles.selectInput}
            value={typeFilter}
            onChange={handleTypeChange}
          >
            <option value="">Todos los Tipos</option>
            <option value="movie">Película</option>
            <option value="tv">Serie de TV</option>
            <option value="documentary">Documental</option>
          </select>
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.moviesGrid}>
        {movies.map((movie) => (
          <div key={movie.id} className={styles.movieItem}>
            <Link href={`/movie/${movie.id}`}>
              <div className={styles.movieImageContainer}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className={styles.movieRatingOverlay}>
                  Rating: {movie.vote_average.toFixed(1)}
                </div>
              </div>
              <h3>{movie.title}</h3>
            </Link>
            <button onClick={() => toggleFavorite(movie.id)}>
              {favorites.includes(movie.id)
                ? 'Eliminar de Favoritos'
                : 'Añadir a Favoritos'}
            </button>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {currentPage < totalPages && (
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreButton} onClick={loadMoreMovies}>
            Ver Más
          </button>
        </div>
      )}
    </div>
  );
}
