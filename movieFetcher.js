// movieFetcher.js
export const TMDB_API_KEY = 'b332a41171225909b9de5b4b6a16881a';

export async function fetchMoviesByGenres(genreIds) {
  const genreParam = genreIds.join(',');

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreParam}&sort_by=popularity.desc`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("TMDb fetch failed");

    const data = await response.json();
    return data.results.slice(0, 15); // Return top 15 movies
  } catch (error) {
    console.error("Movie Fetch Error:", error);
    return [];
  }
}
