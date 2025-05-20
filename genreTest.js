// Simulated genre map as returned from TMDb
const genreIdToName = {
  28: "Action",
  35: "Comedy",
  10749: "Romance",
  18: "Drama",
  878: "Sci-Fi",
  53: "Thriller",
  16: "Animation",
  99: "Documentary",
  9648: "Mystery",
};

// Simulated movie object from TMDb
const movie = {
  title: "Fake Movie Title",
  genre_ids: [28, 35, 9648]
};

// Convert genre_ids to names
const mappedGenres = movie.genre_ids
  .map(id => genreIdToName[id])
  .filter(Boolean)
  .join(", ");

// Log everything
console.log("MOVIE TITLE:", movie.title);
console.log("GENRE IDS:", movie.genre_ids);
console.log("MAPPED GENRES:", mappedGenres);
