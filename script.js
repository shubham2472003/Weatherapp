const apiKey = "470d732f37fb016cb7a640165cd25ccc";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

// Weather by city input
async function getWeather() {
  const cityInput = document.getElementById("cityInput").value.trim();
  const weatherInfo = document.getElementById("weatherInfo");
  weatherInfo.innerHTML = "";

  if (!cityInput) {
    weatherInfo.innerHTML = `<p id="errorMsg">⚠️ Please enter a city name.</p>`;
    return;
  }

  const url = `${apiUrl}?q=${cityInput}&appid=${apiKey}&units=metric`;
  fetchAndDisplay(url);
}

// Weather by geolocation
function getLocationWeather() {
  const weatherInfo = document.getElementById("weatherInfo");
  weatherInfo.innerHTML = "";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        fetchAndDisplay(url);
      },
      (error) => {
        weatherInfo.innerHTML = `<p id="errorMsg">📵 Location access denied. Please allow it to fetch weather for your current location.</p>`;
      }
    );
  } else {
    weatherInfo.innerHTML = `<p id="errorMsg">🌐 Geolocation not supported by your browser.</p>`;
  }
}

// Fetch weather and show
async function fetchAndDisplay(url) {
  const weatherInfo = document.getElementById("weatherInfo");

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "404") {
      weatherInfo.innerHTML = `<p id="errorMsg">❌ City not found.</p>`;
    } else {
      const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="${weatherIcon}" alt="${data.weather[0].description}" />
        <p>🌡️ <strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p>🤒 <strong>Feels Like:</strong> ${data.main.feels_like}°C</p>
        <p>💧 <strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p>🌥️ <strong>Condition:</strong> ${data.weather[0].description}</p>
      `;
    }
  } catch (error) {
    console.error("Error:", error);
    weatherInfo.innerHTML = `<p id="errorMsg">🚫 Failed to fetch weather data.</p>`;
  }
}

// Light/Dark mode toggle
document.getElementById("modeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("modeToggle");
  btn.textContent = document.body.classList.contains("dark") ? "🌙" : "🌞";
});
