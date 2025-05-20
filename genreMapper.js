// genreMapper.js
export function mapMoodToGenreNames(mood) {
  switch (mood.toLowerCase()) {
    case "cozy":
      return ["Romance", "Comedy"];
    case "chill":
      return ["Drama", "Comedy"];
    case "romantic":
      return ["Romance", "Animation"];
    case "thrilling":
      return ["Thriller", "Mystery"];
    case "intense":
      return ["Action", "Horror"];
    case "mysterious":
      return ["Mystery", "Fantasy"];
    case "moody":
      return ["Fantasy", "Drama"];
    case "melancholic":
      return ["Drama", "Music"];
    case "energetic":
      return ["Action", "Adventure"];
    case "anxious":
      return ["Thriller", "Drama"]; // Psychological not in TMDb
    default:
      return ["Drama"];
  }
}
