const apiKey = 'def1f3303c6ef228db2a350316869b71';
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const searchButton = document.getElementById('search-btn');
const currentLocationButton = document.getElementById('current-location-btn');

searchButton.addEventListener('click', () => {
  const city = document.getElementById('city-input').value.trim();
  if (city) {
    fetchWeather(city);
    fetchForecast(city);
  } else {
    alert('Please enter a valid city name.');
  }
});

currentLocationButton.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
      fetchForecastByCoords(latitude, longitude);
    });
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});

function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      updateCurrentWeather(data);
    })
    .catch(error => {
      alert('Error fetching weather data.');
    });
}

function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      updateForecast(data);
    })
    .catch(error => {
      alert('Error fetching forecast data.');
    });
}

function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      updateCurrentWeather(data);
    });
}

function fetchForecastByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      updateForecast(data);
    });
}

function updateCurrentWeather(data) {
  const { name, main, weather, wind } = data;

  currentWeatherDiv.innerHTML = `
    <h2 class="text-xl font-bold">${name} (${new Date().toISOString().split('T')[0]})</h2>
    <p>Temperature: ${main.temp}°C</p>
    <p>Wind: ${wind.speed} m/s</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Condition: ${weather[0].description}</p>
  `;
}

function updateForecast(data) {
  forecastDiv.innerHTML = ''; // Clear previous forecast
  const forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00'));

  forecastList.forEach(day => {
    const { dt_txt, main, weather, wind } = day;

    forecastDiv.innerHTML += `
      <div class="bg-white p-4 rounded shadow text-center">
        <p class="font-bold">${dt_txt.split(' ')[0]}</p>
        <p>Temp: ${main.temp}°C</p>
        <p>Wind: ${wind.speed} m/s</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>${weather[0].description}</p>
      </div>
    `;
  });
}
