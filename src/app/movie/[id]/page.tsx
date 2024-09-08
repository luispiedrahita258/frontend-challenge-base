'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import styles from './page.module.css';

export default function MovieDetails(): JSX.Element {
  const params = useParams();
  const id = params?.id || '';
  const movieId = Array.isArray(id) ? id[0] : id;
  const [movie, setMovie] = useState<any>(null);
  const [credits, setCredits] = useState<any[]>([]);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async (): Promise<void> => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        );
        setMovie(response.data);

        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        );
        setCredits(creditsResponse.data.cast.slice(0, 5));

        const trailerResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        );
        const youtubeTrailer = trailerResponse.data.results.find(
          (video: any) => video.site === 'YouTube' && video.type === 'Trailer',
        );
        setTrailer(
          youtubeTrailer
            ? `https://www.youtube.com/watch?v=${youtubeTrailer.key}`
            : null,
        );

        const reviewsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        );
        setReviews(reviewsResponse.data.results.slice(0, 3));
      } catch (error) {
        console.error('Error al obtener los detalles de la película:', error);
        setError('No se pudieron cargar los detalles de la película.');
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!movie) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.movieDetailsContainer}>
      <h1 className={styles.movieTitle}>{movie.title}</h1>

      <div className={styles.movieMeta}>
        <p>Calificación: {movie.vote_average.toFixed(1)}</p>
        <p>Fecha de estreno: {movie.release_date}</p>
      </div>

      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={movie.title}
        className={styles.moviePoster}
      />

      <p className={styles.movieSummary}>{movie.overview}</p>

      {trailer && (
        <div className={styles.movieTrailer}>
          <h3>Ver el Tráiler:</h3>
          <iframe
            src={trailer}
            title="Tráiler de la Película"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className={styles.movieCast}>
        <h3>Reparto Principal:</h3>
        <ul>
          {credits.map((castMember) => (
            <li key={castMember.cast_id}>
              {castMember.name} como {castMember.character}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.movieReviews}>
        <h3>Reseñas de Usuarios:</h3>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>
                <strong>{review.author}</strong>
                <p>{review.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay reseñas disponibles para esta película.</p>
        )}
      </div>
    </div>
  );
}
