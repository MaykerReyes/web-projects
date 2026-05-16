const DEFAULT_CITY = "Davenport, FL 33837";
const STORAGE_KEYS = {
  city: "weather.lastCity",
  theme: "weather.theme"
};

// Add your API keys here or inject from a secure backend in production.
const API_KEYS = {
  openWeatherMap: "",
  weatherApi: ""
};

const ui = {
  form: document.getElementById("searchForm"),
  cityInput: document.getElementById("cityInput"),
  status: document.getElementById("statusMessage"),
  current: document.getElementById("currentWeatherContent"),
  hourly: document.getElementById("hourlyForecast"),
  daily: document.getElementById("dailyForecast"),
  themeToggle: document.getElementById("themeToggle")
};

init();

function init() {
  loadTheme();
  setupThemeToggle();
  setupSearch();

  const lastCity = localStorage.getItem(STORAGE_KEYS.city) || DEFAULT_CITY;
  ui.cityInput.value = lastCity;
  loadWeather(lastCity);
}

function setupSearch() {
  ui.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = ui.cityInput.value.trim();
    if (!city) {
      setStatus("Enter a city name to search.");
      return;
    }
    localStorage.setItem(STORAGE_KEYS.city, city);
    loadWeather(city);
  });
}

function loadTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
}

function setupThemeToggle() {
  ui.themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem(STORAGE_KEYS.theme, isDark ? "dark" : "light");
  });
}

async function loadWeather(cityQuery) {
  setStatus(`Loading weather for ${cityQuery}...`);

  try {
    const location = await geocodeCity(cityQuery);
    const providers = await fetchProviderForecasts(location);

    if (!providers.length) {
      throw new Error("No weather providers returned data.");
    }

    const merged = reconcileForecasts(providers, location);
    renderWeather(merged);

    const providerNames = providers.map((provider) => provider.provider).join(", ");
    setStatus(`Updated for ${location.displayName}. Sources: ${providerNames}.`);
  } catch (error) {
    console.error(error);
    setStatus(error.message || "Unable to load weather data.");
    renderErrorState();
  }
}

async function geocodeCity(cityQuery) {
  const candidates = getGeocodeCandidates(cityQuery);
  let place = null;

  for (const candidate of candidates) {
    const endpoint = new URL("https://geocoding-api.open-meteo.com/v1/search");
    endpoint.searchParams.set("name", candidate);
    endpoint.searchParams.set("count", "1");
    endpoint.searchParams.set("language", "en");
    endpoint.searchParams.set("format", "json");

    const response = await fetch(endpoint);
    if (!response.ok) {
      continue;
    }

    const payload = await response.json();
    if (payload.results?.[0]) {
      place = payload.results[0];
      break;
    }
  }

  if (!place) {
    throw new Error("City not found. Try city/state or ZIP + country (example: 33837, US).");
  }

  const displayParts = [
    place.name,
    place.admin1,
    place.country_code
  ].filter(Boolean);

  return {
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: place.timezone || "auto",
    displayName: displayParts.join(", ")
  };
}

function getGeocodeCandidates(cityQuery) {
  const normalized = cityQuery.trim().replace(/\s+/g, " ");
  const candidates = [normalized];

  const zipMatch = normalized.match(/\b(\d{5})(?:-\d{4})?\b/);
  const withoutZip = normalized.replace(/\b\d{5}(?:-\d{4})?\b/g, "").replace(/[,\s]+$/g, "").trim();

  if (withoutZip && withoutZip !== normalized) {
    candidates.push(withoutZip);
  }

  if (zipMatch?.[1]) {
    candidates.push(`${zipMatch[1]}, US`);
    candidates.push(zipMatch[1]);
  }

  // Remove duplicate candidates while preserving order.
  return [...new Set(candidates)];
}

async function fetchProviderForecasts(location) {
  const requests = [
    fetchOpenMeteo(location),
    fetchOpenWeather(location),
    fetchWeatherApi(location)
  ];

  const results = await Promise.allSettled(requests);
  const providers = [];
  const failures = [];

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      providers.push(result.value);
    } else if (result.status === "rejected") {
      failures.push(result.reason?.message || "Provider request failed.");
    }
  }

  if (failures.length) {
    console.warn("Some providers failed:", failures);
  }

  if (providers.length < 3) {
    setStatus(
      `Partial data available. Active sources: ${providers.length}/3. Add API keys for all providers for best accuracy.`
    );
  }

  return providers;
}

async function fetchOpenMeteo(location) {
  const endpoint = new URL("https://api.open-meteo.com/v1/forecast");
  endpoint.searchParams.set("latitude", String(location.latitude));
  endpoint.searchParams.set("longitude", String(location.longitude));
  endpoint.searchParams.set(
    "hourly",
    "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation_probability"
  );
  endpoint.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max");
  endpoint.searchParams.set("current", "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code");
  endpoint.searchParams.set("forecast_days", "4");
  endpoint.searchParams.set("timezone", "auto");

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Open-Meteo request failed.");
  }

  const data = await response.json();
  return {
    provider: "Open-Meteo",
    current: {
      tempC: data.current.temperature_2m,
      feelsLikeC: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windKph: data.current.wind_speed_10m,
      condition: weatherCodeToText(data.current.weather_code),
      conditionCode: data.current.weather_code
    },
    hourly: mapOpenMeteoHourly(data),
    daily: mapOpenMeteoDaily(data)
  };
}

async function fetchOpenWeather(location) {
  if (!API_KEYS.openWeatherMap) {
    throw new Error("OpenWeatherMap key missing.");
  }

  const endpoint = new URL("https://api.openweathermap.org/data/2.5/forecast");
  endpoint.searchParams.set("lat", String(location.latitude));
  endpoint.searchParams.set("lon", String(location.longitude));
  endpoint.searchParams.set("appid", API_KEYS.openWeatherMap);
  endpoint.searchParams.set("units", "metric");

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("OpenWeatherMap request failed.");
  }

  const data = await response.json();
  const list = data.list || [];
  if (!list.length) {
    throw new Error("OpenWeatherMap returned no forecast data.");
  }

  return {
    provider: "OpenWeatherMap",
    current: {
      tempC: list[0].main.temp,
      feelsLikeC: list[0].main.feels_like,
      humidity: list[0].main.humidity,
      windKph: msToKph(list[0].wind.speed),
      condition: list[0].weather?.[0]?.main || "Unknown"
    },
    hourly: mapOpenWeatherHourly(list),
    daily: mapOpenWeatherDaily(list)
  };
}

async function fetchWeatherApi(location) {
  if (!API_KEYS.weatherApi) {
    throw new Error("WeatherAPI key missing.");
  }

  const endpoint = new URL("https://api.weatherapi.com/v1/forecast.json");
  endpoint.searchParams.set("key", API_KEYS.weatherApi);
  endpoint.searchParams.set("q", `${location.latitude},${location.longitude}`);
  endpoint.searchParams.set("days", "4");
  endpoint.searchParams.set("aqi", "no");
  endpoint.searchParams.set("alerts", "no");

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("WeatherAPI request failed.");
  }

  const data = await response.json();
  return {
    provider: "WeatherAPI",
    current: {
      tempC: data.current.temp_c,
      feelsLikeC: data.current.feelslike_c,
      humidity: data.current.humidity,
      windKph: data.current.wind_kph,
      condition: data.current.condition?.text || "Unknown"
    },
    hourly: mapWeatherApiHourly(data),
    daily: mapWeatherApiDaily(data)
  };
}

function mapOpenMeteoHourly(data) {
  return data.hourly.time.slice(0, 24).map((time, index) => ({
    time,
    tempC: data.hourly.temperature_2m[index],
    humidity: data.hourly.relative_humidity_2m[index],
    windKph: data.hourly.wind_speed_10m[index],
    precipChance: data.hourly.precipitation_probability[index],
    condition: weatherCodeToText(data.hourly.weather_code[index])
  }));
}

function mapOpenMeteoDaily(data) {
  return data.daily.time.slice(1, 4).map((date, index) => ({
    date,
    highC: data.daily.temperature_2m_max[index + 1],
    lowC: data.daily.temperature_2m_min[index + 1],
    precipChance: data.daily.precipitation_probability_max[index + 1],
    condition: weatherCodeToText(data.daily.weather_code[index + 1])
  }));
}

function mapOpenWeatherHourly(list) {
  return list.slice(0, 8).map((entry) => ({
    time: entry.dt_txt,
    tempC: entry.main.temp,
    humidity: entry.main.humidity,
    windKph: msToKph(entry.wind.speed),
    precipChance: Math.round((entry.pop || 0) * 100),
    condition: entry.weather?.[0]?.main || "Unknown"
  }));
}

function mapOpenWeatherDaily(list) {
  const grouped = groupByDay(list);
  return Object.entries(grouped)
    .slice(1, 4)
    .map(([date, entries]) => {
      const temps = entries.map((entry) => entry.main.temp);
      const precip = entries.map((entry) => Math.round((entry.pop || 0) * 100));
      return {
        date,
        highC: Math.max(...temps),
        lowC: Math.min(...temps),
        precipChance: average(precip),
        condition: mostCommon(entries.map((entry) => entry.weather?.[0]?.main || "Unknown"))
      };
    });
}

function mapWeatherApiHourly(data) {
  const now = Date.now();
  const allHours = data.forecast.forecastday.flatMap((day) => day.hour);
  return allHours
    .filter((hour) => new Date(hour.time).getTime() >= now)
    .slice(0, 24)
    .map((hour) => ({
      time: hour.time,
      tempC: hour.temp_c,
      humidity: hour.humidity,
      windKph: hour.wind_kph,
      precipChance: hour.chance_of_rain,
      condition: hour.condition?.text || "Unknown"
    }));
}

function mapWeatherApiDaily(data) {
  return data.forecast.forecastday.slice(1, 4).map((day) => ({
    date: day.date,
    highC: day.day.maxtemp_c,
    lowC: day.day.mintemp_c,
    precipChance: day.day.daily_chance_of_rain,
    condition: day.day.condition?.text || "Unknown"
  }));
}

function reconcileForecasts(providers, location) {
  const current = {
    tempC: average(providers.map((provider) => provider.current.tempC)),
    feelsLikeC: average(providers.map((provider) => provider.current.feelsLikeC)),
    humidity: average(providers.map((provider) => provider.current.humidity)),
    windKph: average(providers.map((provider) => provider.current.windKph)),
    condition: mostCommon(providers.map((provider) => provider.current.condition))
  };

  const hourly = reconcileSeries(
    providers.map((provider) => provider.hourly),
    24
  );

  const daily = reconcileSeries(
    providers.map((provider) => provider.daily),
    3
  );

  return {
    location: location.displayName,
    current,
    hourly,
    daily
  };
}

function reconcileSeries(seriesList, length) {
  const merged = [];
  for (let index = 0; index < length; index += 1) {
    const entries = seriesList
      .map((series) => series[index])
      .filter(Boolean);

    if (!entries.length) {
      continue;
    }

    merged.push({
      time: entries[0].time,
      date: entries[0].date,
      tempC: average(entries.map((entry) => entry.tempC)),
      humidity: average(entries.map((entry) => entry.humidity)),
      windKph: average(entries.map((entry) => entry.windKph)),
      highC: average(entries.map((entry) => entry.highC)),
      lowC: average(entries.map((entry) => entry.lowC)),
      precipChance: average(entries.map((entry) => entry.precipChance)),
      condition: mostCommon(entries.map((entry) => entry.condition))
    });
  }
  return merged;
}

function renderWeather(weather) {
  const icon = conditionToIcon(weather.current.condition);
  ui.current.innerHTML = `
    <div class="current-main">
      <div>
        <div class="temp-large">${toFixed(cToF(weather.current.tempC))}°F ${icon}</div>
        <div>Feels like ${toFixed(cToF(weather.current.feelsLikeC))}°F</div>
        <div>${escapeHtml(weather.current.condition)} - ${escapeHtml(weather.location)}</div>
      </div>
    </div>
    <div class="meta-grid">
      <div class="meta-item">
        <strong>Humidity</strong>
        <span>${toFixed(weather.current.humidity)}%</span>
      </div>
      <div class="meta-item">
        <strong>Wind</strong>
        <span>${toFixed(weather.current.windKph)} km/h</span>
      </div>
      <div class="meta-item">
        <strong>Sources</strong>
        <span>3-way consensus</span>
      </div>
    </div>
  `;

  ui.hourly.innerHTML = weather.hourly
    .slice(0, 24)
    .map((hour) => {
      const date = new Date(hour.time);
      return `
        <article class="hour-card">
          <strong>${formatHour(date)}</strong>
          <p>${conditionToIcon(hour.condition)} ${escapeHtml(hour.condition)}</p>
          <p>${toFixed(cToF(hour.tempC))}°F</p>
          <p>Wind: ${toFixed(hour.windKph)} km/h</p>
          <p>Humidity: ${toFixed(hour.humidity)}%</p>
        </article>
      `;
    })
    .join("");

  ui.daily.innerHTML = weather.daily
    .slice(0, 3)
    .map((day) => {
      const date = new Date(day.date);
      return `
        <article class="day-card">
          <strong>${formatDay(date)}</strong>
          <p>${conditionToIcon(day.condition)} ${escapeHtml(day.condition)}</p>
          <p>High: ${toFixed(cToF(day.highC))}°F</p>
          <p>Low: ${toFixed(cToF(day.lowC))}°F</p>
          <p>Rain chance: ${toFixed(day.precipChance)}%</p>
        </article>
      `;
    })
    .join("");
}

function renderErrorState() {
  ui.current.innerHTML = "";
  ui.hourly.innerHTML = "";
  ui.daily.innerHTML = "";
}

function setStatus(message) {
  ui.status.textContent = message;
}

function conditionToIcon(condition) {
  const normalized = (condition || "").toLowerCase();
  if (normalized.includes("thunder")) {
    return "⛈️";
  }
  if (normalized.includes("rain") || normalized.includes("drizzle")) {
    return "🌧️";
  }
  if (normalized.includes("snow")) {
    return "❄️";
  }
  if (normalized.includes("cloud") || normalized.includes("overcast")) {
    return "☁️";
  }
  if (normalized.includes("fog") || normalized.includes("mist")) {
    return "🌫️";
  }
  return "☀️";
}

function weatherCodeToText(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Moderate showers",
    82: "Violent showers",
    95: "Thunderstorm"
  };
  return map[code] || "Unknown";
}

function groupByDay(list) {
  return list.reduce((result, entry) => {
    const day = entry.dt_txt.split(" ")[0];
    if (!result[day]) {
      result[day] = [];
    }
    result[day].push(entry);
    return result;
  }, {});
}

function average(values) {
  const nums = values.filter((value) => Number.isFinite(value));
  if (!nums.length) {
    return 0;
  }
  return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}

function mostCommon(values) {
  const counts = new Map();
  for (const value of values) {
    if (!value) {
      continue;
    }
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  let bestValue = "Unknown";
  let bestCount = -1;
  for (const [value, count] of counts.entries()) {
    if (count > bestCount) {
      bestValue = value;
      bestCount = count;
    }
  }
  return bestValue;
}

function formatHour(date) {
  return date.toLocaleTimeString([], { hour: "numeric" });
}

function formatDay(date) {
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function msToKph(value) {
  return value * 3.6;
}

function cToF(value) {
  if (!Number.isFinite(value)) {
    return value;
  }
  return (value * 9) / 5 + 32;
}

function toFixed(value) {
  return Number.isFinite(value) ? value.toFixed(1) : "-";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
