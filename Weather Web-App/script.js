const API_KEY = '540630eba60c4eb675568d16a520bf33';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherBox = document.getElementById('weatherBox');
const errorMsg = document.getElementById('errorMsg');

const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');

const ICON_PATH = 'assets/icons/';
const ICON_MAP = {
  Clear:  { file: 'sun.png',   css: 'sunny'  },
  Clouds: { file: 'cloud.png', css: 'cloudy' },
  Rain:   { file: 'rain.png',  css: 'rainy'  },
  Snow:   { file: 'snow.png',  css: 'snowy'  }
};

function injectIcon(element, condition) {
  const map = ICON_MAP[condition] || ICON_MAP.Clear;
  element.className = `icon ${map.css}`;
  element.innerHTML = `<img src="${ICON_PATH}${map.file}" alt="${condition} icon">`;
}

function setBackgroundTheme(condition, data) {
  const isNight = data.dt < data.sys.sunrise || data.dt > data.sys.sunset;
  document.body.className = '';

  if (isNight) {
    document.body.classList.add('night');
  } else {
    document.body.classList.add(condition.toLowerCase());
  }
}

function displayWeather(data) {
  const condition = data.weather[0].main;
  cityName.textContent = data.name;
  temperature.textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
  description.textContent = `Condition: ${data.weather[0].description}`;

  injectIcon(weatherIcon, condition);
  setBackgroundTheme(condition, data);

  weatherBox.classList.remove('hidden');
  errorMsg.classList.add('hidden');
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove('hidden');
  weatherBox.classList.add('hidden');
  document.body.className = '';
}

function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('City not found');
      return res.json();
    })
    .then(data => displayWeather(data))
    .catch(err => showError(err.message));
}

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

cityInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
  }
});
