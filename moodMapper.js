// moodMapper.js
// moodMapper.js
export function mapWeatherToMood(condition) {
  const weather = condition.toLowerCase();

  switch (weather) {
    case "clouds":
    case "overcast":
    case "rain":
    case "drizzle":
      return "cozy";

    case "snow":
    case "hail":
      return "mysterious";

    case "clear":
    case "sunny":
      return "energetic";

    case "thunderstorm":
    case "squall":
      return "intense";

    case "wind":
    case "windy":
      return "anxious";

    case "fog":
    case "mist":
    case "smoke":
      return "moody";

    case "haze":
    case "dust":
    case "ash":
      return "melancholic";

    case "tornado":
      return "thrilling";

    default:
      return "chill";
  }
}
