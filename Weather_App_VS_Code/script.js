const defaultCity = 'Davenport, FL';
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const currentTemp = document.getElementById('current-temp');
const currentDesc = document.getElementById('current-desc');
const currentFeels = document.getElementById('current-feels');
const currentWind = document.getElementById('current-wind');
const currentHumidity = document.getElementById('current-humidity');
const hourlyGrid = document.getElementById('hourly-grid');
const dailyGrid = document.getElementById('daily-grid');

const OPENWEATHER_API_KEY = '';
const WEATHERAPI_KEY = '';

async function init() {
  const savedCity = localStorage.getItem('weatherCity');
  const city = savedCity || defaultCity;
  cityInput.value = city;
  await fetchWeather(city);
}

searchBtn.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (!city) return;
  await fetchWeather(city);
});

cityInput.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;
    await fetchWeather(city);
  }
});

async function fetchWeather(city) {
  showLoading();
  try {
    const geocode = await geocodeCity(city);
    if (!geocode) throw new Error('Unable to resolve city.');

    const [openMeteo, openWeather, weatherApi] = await Promise.all([
      fetchOpenMeteo(geocode),
      fetchOpenWeatherMap(geocode),
      fetchWeatherAPI(geocode),
    ]);

    const combined = combineWeatherData(openMeteo, openWeather, weatherApi);
    renderCurrentWeather(combined);
    renderHourlyForecast(combined.hourly);
    renderDailyForecast(combined.daily);

    localStorage.setItem('weatherCity', city);
  } catch (error) {
    console.error(error);
    showError('Could not load weather. Check the city name or API configuration.');
  }
}

function showLoading() {
  currentTemp.textContent = '--°';
  currentDesc.textContent = 'Loading...';
  currentFeels.textContent = 'Feels like --°F';
  currentWind.textContent = '--';
  currentHumidity.textContent = '--';
  hourlyGrid.innerHTML = '';
  dailyGrid.innerHTML = '';
}

function showError(message) {
  currentDesc.textContent = message;
  currentFeels.textContent = 'Feels like --°F';
  hourlyGrid.innerHTML = '';
  dailyGrid.innerHTML = '';
}

async function geocodeCity(city) {
  const encoded = encodeURIComponent(city);
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data || data.length === 0) return null;
  return {
    name: data[0].display_name,
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}

async function fetchOpenMeteo({ lat, lon }) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&current_weather=true&timezone=auto`;
  const response = await fetch(url);
  return response.json();
}

async function fetchOpenWeatherMap({ lat, lon }) {
  if (!OPENWEATHER_API_KEY) return null;
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=imperial&appid=${OPENWEATHER_API_KEY}`;
  const response = await fetch(url);
  return response.json();
}

async function fetchWeatherAPI({ lat, lon }) {
  if (!WEATHERAPI_KEY) return null;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`;
  const response = await fetch(url);
  return response.json();
}

function combineWeatherData(openMeteo, openWeather, weatherApi) {
  const currentTemp = averageValues([
    toFahrenheit(openMeteo?.current_weather?.temperature),
    openWeather?.current?.temp,
    toFahrenheit(weatherApi?.current?.temp_c),
  ]);
  const currentWind = averageValues([
    toMph(openMeteo?.current_weather?.windspeed),
    openWeather?.current?.wind_speed,
    toMph(weatherApi?.current?.wind_kph),
  ]);
  const currentHumidity = averageValues([
    openMeteo?.hourly?.relativehumidity_2m?.[0],
    openWeather?.current?.humidity,
    weatherApi?.current?.humidity,
  ]);
  const currentTempF = averageValues([
    toFahrenheit(openMeteo?.current_weather?.temperature),
    openWeather?.current?.temp,
    toFahrenheit(weatherApi?.current?.temp_c),
  ]);
  const currentFeels = openWeather?.current?.feels_like ?? weatherApi?.current?.feelslike_f ?? computeHeatIndex(currentTempF, currentHumidity);
  const description = weatherApi?.current?.condition?.text || openWeather?.current?.weather?.[0]?.description || 'Weather data';

  const hourly = buildHourlyForecast(openMeteo, openWeather, weatherApi);
  const daily = buildDailyForecast(openMeteo, openWeather, weatherApi);

  return {
    current: {
      temp: currentTemp,
      wind: currentWind,
      humidity: currentHumidity,
      feels: currentFeels,
      description,
    },
    hourly,
    daily,
  };
}

function averageValues(values) {
  const numeric = values.filter((value) => typeof value === 'number' && !Number.isNaN(value));
  if (numeric.length === 0) return null;
  return numeric.reduce((sum, value) => sum + value, 0) / numeric.length;
}

function toFahrenheit(celsius) {
  if (typeof celsius !== 'number' || Number.isNaN(celsius)) return null;
  return celsius * 9 / 5 + 32;
}

function toMph(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  return value * 2.2369362920544;
}

function computeHeatIndex(tempF, humidity) {
  if (typeof tempF !== 'number' || typeof humidity !== 'number') return null;
  if (Number.isNaN(tempF) || Number.isNaN(humidity)) return null;
  if (tempF < 80 || humidity < 40) return tempF;
  const hi = -42.379 +
    2.04901523 * tempF +
    10.14333127 * humidity -
    0.22475541 * tempF * humidity -
    0.00683783 * tempF * tempF -
    0.05481717 * humidity * humidity +
    0.00122874 * tempF * tempF * humidity +
    0.00085282 * tempF * humidity * humidity -
    0.00000199 * tempF * tempF * humidity * humidity;
  return hi;
}

function buildHourlyForecast(openMeteo, openWeather, weatherApi) {
  if (!openMeteo?.hourly) return [];
  const entries = [];
  for (let index = 0; index < 24; index += 1) {
    const time = openMeteo.hourly.time[index];
    const temp = averageValues([
      toFahrenheit(openMeteo.hourly.temperature_2m[index]),
      openWeather?.hourly?.[index]?.temp,
      toFahrenheit(weatherApi?.forecast?.forecastday?.[0]?.hour?.[index]?.temp_c),
    ]);
    const wind = averageValues([
      toMph(openMeteo.hourly.windspeed_10m[index]),
      openWeather?.hourly?.[index]?.wind_speed,
      toMph(weatherApi?.forecast?.forecastday?.[0]?.hour?.[index]?.wind_kph),
    ]);
    const humidity = averageValues([
      openMeteo.hourly.relativehumidity_2m[index],
      openWeather?.hourly?.[index]?.humidity,
      weatherApi?.forecast?.forecastday?.[0]?.hour?.humidity,
    ]);
    const condition = weatherApi?.forecast?.forecastday?.[0]?.hour?.[index]?.condition?.text || '—';

    entries.push({ time, temp, wind, humidity, condition });
  }
  return entries;
}

function buildDailyForecast(openMeteo, openWeather, weatherApi) {
  if (!openMeteo?.daily?.time) return [];
  const days = [];
  const count = 3;
  const today = new Date().toISOString().slice(0, 10);
  const startIndex = Math.max(0, openMeteo.daily.time.findIndex((date) => date >= today));

  for (let dayIndex = startIndex; dayIndex < startIndex + count; dayIndex += 1) {
    const sourceIndex = dayIndex - startIndex;
    const date = openMeteo?.daily?.time?.[dayIndex];
    const minTemp = averageValues([
      toFahrenheit(openMeteo?.daily?.temperature_2m_min?.[dayIndex]),
      openWeather?.daily?.[sourceIndex]?.temp?.min,
      toFahrenheit(weatherApi?.forecast?.forecastday?.[sourceIndex]?.day?.mintemp_c),
    ]);
    const maxTemp = averageValues([
      toFahrenheit(openMeteo?.daily?.temperature_2m_max?.[dayIndex]),
      openWeather?.daily?.[sourceIndex]?.temp?.max,
      toFahrenheit(weatherApi?.forecast?.forecastday?.[sourceIndex]?.day?.maxtemp_c),
    ]);
    const precipitation = averageValues([
      openMeteo?.daily?.precipitation_probability_max?.[dayIndex],
      openWeather?.daily?.[sourceIndex]?.pop * 100,
      weatherApi?.forecast?.forecastday?.[sourceIndex]?.day?.daily_chance_of_rain,
    ]);
    const condition = weatherApi?.forecast?.forecastday?.[sourceIndex]?.day?.condition?.text || '—';

    days.push({ date, minTemp, maxTemp, precipitation, condition });
  }
  return days;
}

function formatHour(timeString) {
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
}

function formatDate(timeString) {
  const date = new Date(timeString);
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

function renderCurrentWeather(data) {
  currentTemp.textContent = data.current.temp ? `${Math.round(data.current.temp)}°F` : '--°F';
  currentDesc.textContent = data.current.description || 'No description available';
  currentFeels.textContent = data.current.feels ? `Feels like ${Math.round(data.current.feels)}°F` : 'Feels like --°F';
  currentWind.textContent = data.current.wind ? `${Math.round(data.current.wind)} mph` : '--';
  currentHumidity.textContent = data.current.humidity ? `${Math.round(data.current.humidity)}%` : '--';
}

function renderHourlyForecast(hourly) {
  hourlyGrid.innerHTML = '';
  hourly.forEach((entry) => {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <p class="forecast-time">${formatHour(entry.time)}</p>
      <p>${entry.condition}</p>
      <p><strong>${entry.temp ? `${Math.round(entry.temp)}°F` : '--°F'}</strong></p>
      <p>Wind: ${entry.wind ? `${Math.round(entry.wind)} mph` : '--'}</p>
      <p>Humidity: ${entry.humidity ? `${Math.round(entry.humidity)}%` : '--'}</p>
    `;
    hourlyGrid.appendChild(card);
  });
}

function renderDailyForecast(daily) {
  dailyGrid.innerHTML = '';
  daily.forEach((entry) => {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <p class="forecast-time">${formatDate(entry.date)}</p>
      <p>${entry.condition}</p>
      <p>High: ${entry.maxTemp ? `${Math.round(entry.maxTemp)}°F` : '--°F'}</p>
      <p>Low: ${entry.minTemp ? `${Math.round(entry.minTemp)}°F` : '--°F'}</p>
      <p>Precip: ${entry.precipitation !== null ? `${Math.round(entry.precipitation)}%` : '--'}</p>
    `;
    dailyGrid.appendChild(card);
  });
}

init().catch((error) => console.error(error));
