// script.js

import { mapWeatherToMood } from './moodMapper.js';
import { mapMoodToGenreNames } from './genreMapper.js';
import { fetchMoviesByGenres } from './movieFetcher.js';

const BACKEND_BASE_URL = "https://moodmatch-backend.onrender.com";


let genreIdToName = {};
let userPreferredGenres = [];

// Fetch genre map from TMDb and store ID-name pairs
async function fetchGenreMap() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch genre list");
    const data = await response.json();

    genreIdToName = {};
    data.genres.forEach(genre => {
      genreIdToName[Number(genre.id)] = genre.name;
    });

    console.log("✅ Genre map loaded:", genreIdToName);
  } catch (error) {
    console.error("Genre map fetch failed:", error);
  }
}

// Convert genre names to IDs using the dynamic map
function genreNamesToIds(names) {
  return names
    .map(name => {
      const id = Object.keys(genreIdToName).find(
        key => genreIdToName[key].toLowerCase() === name.toLowerCase()
      );
      return id ? Number(id) : null;
    })
    .filter(Boolean);
}

// Fetch weather and movie recommendations based on mood or preferences
function fetchWeather() {
  const city = document.getElementById("city-input").value;
  const resultDiv = document.getElementById("weather-result");
  const movieDiv = document.getElementById("movie-result");

  if (!city) {
    resultDiv.textContent = "Please enter a city.";
    return;
  }

  if (Object.keys(genreIdToName).length === 0) {
    alert("Genres are still loading. Please wait a moment and try again.");
    return;
  }

 const url = `${BACKEND_BASE_URL}/weather?city=${city}`;


  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(async data => {
      const temp = data.main.temp;
      const condition = data.weather[0].main;
      const mood = mapWeatherToMood(condition);
      const genreNames = mapMoodToGenreNames(mood);
      const moodGenres = genreNamesToIds(genreNames);
      const finalGenres = userPreferredGenres.length > 0 ? userPreferredGenres : moodGenres;

      console.log("🌤️ Condition:", condition);
      console.log("🧠 Mood:", mood);
      console.log("🎭 Genre Names:", genreNames);
      console.log("🎯 Genre IDs:", moodGenres);
      console.log("📦 Final Genre IDs Used:", finalGenres);

      resultDiv.textContent = `🌡️ ${temp}°C - ${condition} → Mood: ${mood}`;

      const movies = await fetchMoviesByGenres(finalGenres);

      movieDiv.innerHTML = "<h4>🎬 You might like to see:</h4>";
      movies.forEach(movie => {
        const movieGenres = (movie.genre_ids || [])
          .map(id => genreIdToName[id])
          .filter(Boolean)
          .join(", ");

        console.log("🎬 Movie:", movie.title);
        console.log("📚 Genre IDs:", movie.genre_ids);
        console.log("📖 Genre Names:", movieGenres);

        const genreBadges = movie.genre_ids
          .map(id => genreIdToName[id])
          .filter(Boolean)
          .map(name => `<span class="genre-badge">${name}</span>`)
          .join(" ");

        const posterUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
          : 'https://via.placeholder.com/150x225?text=No+Image';

        movieDiv.innerHTML += `
         <div class="movie-card">
          <img class="movie-poster" src="${posterUrl}" alt="${movie.title}">
          <div class="movie-info">
           <div class="movie-title">${movie.title} (${movie.release_date?.split('-')[0]})</div>
           <div class="movie-overview">${movie.overview.slice(0, 200)}...</div>
           <div class="movie-genres">${genreBadges}</div>
          </div>
         </div>
        `;


      });
    })
    .catch(error => {
      resultDiv.textContent = "Error: " + error.message;
    });
}

window.fetchWeather = fetchWeather;

document.addEventListener("DOMContentLoaded", async () => {
  // Preferences load logic...
  const stored = localStorage.getItem("preferredGenres");
  if (stored) {
    userPreferredGenres = JSON.parse(stored);
    console.log("🗂️ Loaded user preferences:", userPreferredGenres);
  }

  await fetchGenreMap(); // Load genre map

  // 🔽 Dropdown toggle logic
  const toggleBtn = document.getElementById("toggle-preferences");
  const panel = document.getElementById("preferences-panel");

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    panel.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    const isClickInside = panel.contains(e.target) || toggleBtn.contains(e.target);
    if (!isClickInside && panel.classList.contains("open")) {
      panel.classList.remove("open");
    }
  });
  const geoButton = document.getElementById("geo-button");

  geoButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherByCoords(lat, lon);
    },
    (error) => {
      alert("Unable to retrieve your location.");
      console.error("Geolocation Error:", error);
    }
  );
});

});

async function fetchWeatherByCoords(lat, lon) {
  const resultDiv = document.getElementById("weather-result");
  const movieDiv = document.getElementById("movie-result");

  const url = `${BACKEND_BASE_URL}/weather/coords?lat=${lat}&lon=${lon}`;


  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather fetch failed by coordinates");
    const data = await response.json();

    const temp = data.main.temp;
    const condition = data.weather[0].main;
    const mood = mapWeatherToMood(condition);
    const genreNames = mapMoodToGenreNames(mood);
    const moodGenres = genreNamesToIds(genreNames);
    const finalGenres = userPreferredGenres.length > 0 ? userPreferredGenres : moodGenres;

    // Update body mood class
    document.body.className = document.body.className
      .split(' ')
      .filter(c => !c.startsWith("mood-"))
      .join(' ');
    document.body.classList.add(`mood-${mood}`);

    resultDiv.textContent = `🌡️ ${temp}°C - ${condition} → Mood: ${mood}`;

    const movies = await fetchMoviesByGenres(finalGenres);
    movieDiv.innerHTML = "<h4>🎬 You might like to see:</h4>";

    movies.forEach(movie => {
      const genreBadges = (movie.genre_ids || [])
        .map(id => genreIdToName[id])
        .filter(Boolean)
        .map(name => `<span class="genre-badge">${name}</span>`)
        .join(" ");

      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        : 'https://via.placeholder.com/150x225?text=No+Image';

      movieDiv.innerHTML += `
        <div class="movie-card">
          <img class="movie-poster" src="${posterUrl}" alt="${movie.title}">
          <div class="movie-info">
            <div class="movie-title">${movie.title} (${movie.release_date?.split('-')[0]})</div>
            <div class="movie-overview">${movie.overview.slice(0, 200)}...</div>
            <div class="movie-genres">${genreBadges}</div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    resultDiv.textContent = "Geolocation Error: " + error.message;
  }
}





