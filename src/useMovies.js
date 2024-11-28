import { useState, useEffect } from "react";

const KEY = `fb1d9a7c`;

export function useMovies(query, callback) {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(
        function () {

            callback?.()

            const controller = new AbortController();

            async function fetchMovies() {
                try {
                    setLoading(true);
                    setError("");
                    const res = await fetch(
                        `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                        { signal: controller.signal }
                    );

                    if (!res.ok) throw new Error("Something went wrong... :/");

                    const data = await res.json();

                    if (data.Response === "False")
                        throw new Error("No movies found for the query string");

                    setMovies(data.Search);
                    setError("");
                } catch (error) {
                    if (error.name !== "AbortError") {
                        setError(error.message);
                    }
                } finally {
                    setLoading(false);
                }
            }

            if (query.length < 3) {
                setMovies([]);
                setError("");
                return;
            }

            // closeMovieDetails();
            fetchMovies();

            return () => controller.abort();
        },
        [query]
    );

    return { movies, error, loading }
}