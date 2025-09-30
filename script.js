const apiKey = "560f102633b77a6e03d83cd95f311a54"; 
const weatherDiv = document.getElementById("weather");
const forecastDiv = document.getElementById("forecast");


document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) fetchWeather(city);
});

document.getElementById("locBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      err => {
        weatherDiv.innerHTML = `<p>Unable to get location ❌</p>`;
      }
    );
  } else {
    weatherDiv.innerHTML = `<p>Geolocation not supported ❌</p>`;
  }
});

async function fetchWeather(city) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await res.json();

    if (data.cod !== 200) {  
      displayWeather(data);
      return;
    }

    displayWeather(data);
    fetchForecast(data.coord.lat, data.coord.lon);
  } catch (err) {
    weatherDiv.innerHTML = `<p>Error fetching weather ❌</p>`;
    console.error(err);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const data = await res.json();

    if (data.cod !== 200) {
      displayWeather(data);
      return;
    }

    displayWeather(data);
    fetchForecast(lat, lon);
  } catch (err) {
    weatherDiv.innerHTML = `<p>Error fetching weather ❌</p>`;
    console.error(err);
  }
}

async function fetchForecast(lat, lon) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const data = await res.json();

    if (data.cod !== "200") {
      forecastDiv.innerHTML = `<p>Forecast not available ❌</p>`;
      return;
    }

    displayForecast(data);
  } catch (err) {
    forecastDiv.innerHTML = `<p>Error fetching forecast ❌</p>`;
    console.error(err);
  }
}

function displayWeather(data) {
  if (data.cod !== 200) {
    weatherDiv.innerHTML = `<p>${data.message || "City not found ❌"}</p>`;
    return;
  }

  weatherDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>🌡 ${data.main.temp}°C</p>
    <p>${data.weather[0].description}</p>
  `;
}

function displayForecast(data) {
  forecastDiv.innerHTML = "";
  const daily = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!daily[date]) daily[date] = item;
  });

  Object.values(daily).slice(0, 5).forEach(day => {
    forecastDiv.innerHTML += `
      <div class="forecast-day">
        <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
        <p>🌡 ${day.main.temp}°C</p>
        <p>${day.weather[0].main}</p>
      </div>
    `;
  });
}

