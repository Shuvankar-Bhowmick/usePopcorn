import { useState, useEffect } from "react";

const KEY = "bb4b82b0";

// A custom hook needs to use atleast one hook otherwise it's just a plain function
// Not a component but a function, hence we don't expect props but arguments
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const timeoutId = setTimeout(
        async function fetchMovies() {
          try {
            setIsLoading(true);
            setError("");
            const res = await fetch(
              `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
            );

            if (!res.ok)
              throw new Error("Something went wrong with fetching movies");

            const data = await res.json();
            if (data.Response === "False") throw new Error("Movie not found");

            setMovies(data.Search);
          } catch (err) {
            if (err.name !== "AbortError") setError(err.message);
          } finally {
            setIsLoading(false);
          }

          if (query.length < 3) {
            setMovies([]);
            setError("");
            return;
          }
        },

        500
      );
      return () => {
        clearTimeout(timeoutId);
      };
    },
    [query]
  );

  return {
    movies,
    isLoading,
    error,
  };
}
