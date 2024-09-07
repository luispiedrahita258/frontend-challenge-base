"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Favorites() {
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 


  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    console.log("Stored favorites in localStorage:", storedFavorites);

    if (storedFavorites) {
      const favoriteIds = JSON.parse(storedFavorites);
      console.log("Favorite IDs:", favoriteIds);

      if (favoriteIds.length > 0) {
        const fetchFavoriteMovies = async () => {
          try {
            const movieRequests = favoriteIds.map((id: string) => {
              const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
              console.log("Fetching movie from URL:", url);
              return axios.get(url);
            });

            const movieResponses = await Promise.all(movieRequests);
            const moviesData = movieResponses.map((res) => res.data);
            setFavoriteMovies(moviesData);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching favorite movies:", error);
            setError("Could not load favorite movies.");
            setLoading(false);
          }
        };

        fetchFavoriteMovies();
      } else {
        console.log("No valid favorite IDs found.");
        setLoading(false);
      }
    } else {
      console.log("No favorites found in localStorage.");
      setLoading(false);
    }
  }, []);

  const removeFavorite = (movieId: string) => {
    const updatedFavorites = favoriteMovies.filter(
      (movie) => movie.id !== movieId
    );
    setFavoriteMovies(updatedFavorites);

    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    const updatedStoredFavorites = storedFavorites.filter(
      (id: string) => id !== movieId
    );
    localStorage.setItem("favorites", JSON.stringify(updatedStoredFavorites));
  };

  if (loading) {
    return <div>Loading your favorite movies...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  if (favoriteMovies.length === 0) {
    return <div>You haven't added any favorite movies yet!</div>;
  }

  return (
    <div>
      <h2>Your Favorite Movies</h2>
      <div className="movies-grid">
        {favoriteMovies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={`Poster of ${movie.title}`}
            />
            <h3>{movie.title}</h3>
            <button onClick={() => removeFavorite(movie.id)}>
              Remove from Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
