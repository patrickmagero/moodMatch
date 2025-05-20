// movieFetcher.js
 const BACKEND_BASE_URL = "https://moodmatch-backend.onrender.com";

export async function fetchMoviesByGenres(genreIds) {
  const genreParam = genreIds.join(',');
  const url = `${BACKEND_BASE_URL}/movies?genres=${genreParam}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Backend fetch failed");

    const data = await response.json();
    return data; // Already sliced to top 15
  } catch (error) {
    console.error("Movie Fetch Error:", error);
    return [];
  }
}

