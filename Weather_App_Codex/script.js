const DEFAULT_QUERY = "Davenport, FL 33837";

const CONFIG = {
  // Optional: paste free-tier keys here for additional keyed sources.
  openWeatherMapKey: "",
  weatherApiKey: ""
};

const state = {
  query: localStorage.getItem("weather:last-city") || DEFAULT_QUERY
};

const elements = {
  form: document.querySelector("#searchForm"),
  input: document.querySelector("#cityInput"),
  status: document.querySelector("#status"),
  placeName: document.querySelector("#placeName"),
  updatedAt: document.querySelector("#updatedAt"),
  currentIcon: document.querySelector("#currentIcon"),
  currentTemp: document.querySelector("#currentTemp"),
  currentFeelsLike: document.querySelector("#currentFeelsLike"),
  currentCondition: document.querySelector("#currentCondition"),
  currentWind: document.querySelector("#currentWind"),
  currentHumidity: document.querySelector("#currentHumidity"),
  currentPrecip: document.querySelector("#currentPrecip"),
  hourlyForecast: document.querySelector("#hourlyForecast"),
  dailyForecast: document.querySelector("#dailyForecast"),
  sourceSummary: document.querySelector("#sourceSummary"),
  themeToggle: document.querySelector("#themeToggle")
};

const weatherCodes = {
  0: ["Clear", "☀"],
  1: ["Mostly clear", "🌤"],
  2: ["Partly cloudy", "⛅"],
  3: ["Cloudy", "☁"],
  45: ["Fog", "▤"],
  48: ["Rime fog", "▤"],
  51: ["Light drizzle", "🌦"],
  53: ["Drizzle", "🌦"],
  55: ["Heavy drizzle", "🌧"],
  61: ["Light rain", "🌦"],
  63: ["Rain", "🌧"],
  65: ["Heavy rain", "🌧"],
  71: ["Light snow", "❄"],
  73: ["Snow", "❄"],
  75: ["Heavy snow", "❄"],
  80: ["Rain showers", "🌦"],
  81: ["Showers", "🌧"],
  82: ["Heavy showers", "🌧"],
  95: ["Thunderstorms", "⛈"],
  96: ["Thunderstorms", "⛈"],
  99: ["Severe storms", "⛈"]
};

const wttrIconMap = [
  [/thunder/i, "⛈"],
  [/snow|sleet|ice/i, "❄"],
  [/rain|drizzle|shower/i, "🌧"],
  [/fog|mist|haze/i, "▤"],
  [/cloud|overcast/i, "☁"],
  [/sun|clear/i, "☀"]
];

elements.input.value = state.query;
document.body.classList.toggle("dark", localStorage.getItem("weather:theme") === "dark");

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = elements.input.value.trim();
  if (query) {
    state.query = query;
    localStorage.setItem("weather:last-city", query);
    loadWeather(query);
  }
});

elements.themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("weather:theme", document.body.classList.contains("dark") ? "dark" : "light");
});

loadWeather(state.query);

async function loadWeather(query) {
  setStatus(`Looking up ${query}...`);
  clearForecasts();

  try {
    const place = await geocode(query);
    elements.placeName.textContent = place.name;
    setStatus("Fetching forecast sources...");

    const sourceResults = await Promise.allSettled([
      fetchOpenMeteo(place),
      fetchMetNorway(place),
      fetchWttr(place),
      fetchOpenWeatherMap(place),
      fetchWeatherApi(place)
    ]);

    const sources = sourceResults
      .filter((result) => result.status === "fulfilled" && result.value)
      .map((result) => result.value);

    if (!sources.length) {
      throw new Error("No weather source returned usable data.");
    }

    const merged = mergeSources(sources);
    renderWeather(place, merged, sources);
    setStatus(`Updated from ${sources.length} source${sources.length === 1 ? "" : "s"}.`);
  } catch (error) {
    console.error(error);
    setStatus(error.message || "Unable to load weather data. Try another city.");
  }
}

async function geocode(query) {
  if (query.replace(/\s+/g, " ").trim().toLowerCase() === DEFAULT_QUERY.toLowerCase()) {
    return {
      name: "Davenport, FL 33837",
      latitude: 28.1614,
      longitude: -81.6017,
      timezone: "America/New_York"
    };
  }

  const attempts = buildGeocodeAttempts(query);
  let result;

  for (const attempt of attempts) {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.search = new URLSearchParams({
      name: attempt,
      count: "1",
      language: "en",
      format: "json"
    });

    const data = await fetchJson(url);
    result = data.results?.[0];
    if (result) break;
  }

  if (!result) {
    throw new Error(`No matching city found for "${query}".`);
  }

  const admin = [result.admin1, result.country_code].filter(Boolean).join(", ");
  return {
    name: `${result.name}${admin ? `, ${admin}` : ""}`,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone || "auto"
  };
}

function buildGeocodeAttempts(query) {
  const normalized = query.trim();
  const withoutZip = normalized.replace(/\b\d{5}(?:-\d{4})?\b/g, "").replace(/\s+,/g, ",").replace(/,\s*$/, "").trim();
  const firstSegment = normalized.split(",")[0].trim();
  return [...new Set([normalized, withoutZip, firstSegment].filter(Boolean))];
}

async function fetchOpenMeteo(place) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
    hourly: "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    precipitation_unit: "inch",
    timezone: "auto",
    forecast_days: "4"
  });

  const data = await fetchJson(url);
  return {
    name: "Open-Meteo",
    current: {
      temp: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      wind: data.current.wind_speed_10m,
      precip: data.hourly.precipitation_probability?.[0],
      condition: codeToCondition(data.current.weather_code),
      icon: codeToIcon(data.current.weather_code)
    },
    hourly: data.hourly.time.slice(0, 24).map((time, index) => ({
      time,
      temp: data.hourly.temperature_2m[index],
      feelsLike: data.hourly.apparent_temperature[index],
      humidity: data.hourly.relative_humidity_2m[index],
      wind: data.hourly.wind_speed_10m[index],
      precip: data.hourly.precipitation_probability[index],
      condition: codeToCondition(data.hourly.weather_code[index]),
      icon: codeToIcon(data.hourly.weather_code[index])
    })),
    daily: data.daily.time.slice(0, 3).map((date, index) => ({
      date,
      high: data.daily.temperature_2m_max[index],
      low: data.daily.temperature_2m_min[index],
      precip: data.daily.precipitation_probability_max[index],
      condition: codeToCondition(data.daily.weather_code[index]),
      icon: codeToIcon(data.daily.weather_code[index])
    }))
  };
}

async function fetchMetNorway(place) {
  const url = new URL("https://api.met.no/weatherapi/locationforecast/2.0/compact");
  url.search = new URLSearchParams({
    lat: place.latitude.toFixed(4),
    lon: place.longitude.toFixed(4)
  });

  const data = await fetchJson(url, {
    headers: {
      "Accept": "application/json"
    }
  });

  const timeseries = data.properties.timeseries;
  const hourly = timeseries.slice(0, 24).map((entry) => {
    const details = entry.data.instant.details;
    const symbol = entry.data.next_1_hours?.summary?.symbol_code || entry.data.next_6_hours?.summary?.symbol_code || "";
    return {
      time: entry.time,
      temp: cToF(details.air_temperature),
      feelsLike: calculateFeelsLike(cToF(details.air_temperature), details.relative_humidity, mpsToMph(details.wind_speed)),
      humidity: details.relative_humidity,
      wind: mpsToMph(details.wind_speed),
      precip: entry.data.next_1_hours?.details?.precipitation_amount ? 70 : undefined,
      condition: symbolToCondition(symbol),
      icon: symbolToIcon(symbol)
    };
  });

  return {
    name: "MET Norway",
    current: hourly[0],
    hourly,
    daily: groupHourlyIntoDaily(hourly)
  };
}

async function fetchWttr(place) {
  const url = `https://wttr.in/${place.latitude},${place.longitude}?format=j1`;
  const data = await fetchJson(url);
  const current = data.current_condition?.[0];
  const hourly = data.weather?.[0]?.hourly?.map((entry) => ({
    time: timeFromWttr(data.weather[0].date, entry.time),
    temp: Number(entry.tempF),
    feelsLike: Number(entry.FeelsLikeF),
    humidity: Number(entry.humidity),
    wind: Number(entry.windspeedMiles),
    precip: Number(entry.chanceofrain || entry.chanceofsnow || 0),
    condition: entry.weatherDesc?.[0]?.value || "Unknown",
    icon: descToIcon(entry.weatherDesc?.[0]?.value || "")
  })) || [];

  return {
    name: "wttr.in",
    current: current ? {
      temp: Number(current.temp_F),
      feelsLike: Number(current.FeelsLikeF),
      humidity: Number(current.humidity),
      wind: Number(current.windspeedMiles),
      precip: Number(current.precipMM) > 0 ? 80 : undefined,
      condition: current.weatherDesc?.[0]?.value || "Unknown",
      icon: descToIcon(current.weatherDesc?.[0]?.value || "")
    } : hourly[0],
    hourly: expandThreeHourData(hourly).slice(0, 24),
    daily: data.weather.slice(0, 3).map((day) => ({
      date: day.date,
      high: Number(day.maxtempF),
      low: Number(day.mintempF),
      precip: maxNumber(day.hourly.map((entry) => Number(entry.chanceofrain || 0))),
      condition: day.hourly[4]?.weatherDesc?.[0]?.value || day.hourly[0]?.weatherDesc?.[0]?.value || "Forecast",
      icon: descToIcon(day.hourly[4]?.weatherDesc?.[0]?.value || "")
    }))
  };
}

async function fetchOpenWeatherMap(place) {
  if (!CONFIG.openWeatherMapKey) return null;
  const url = new URL("https://api.openweathermap.org/data/2.5/forecast");
  url.search = new URLSearchParams({
    lat: place.latitude,
    lon: place.longitude,
    appid: CONFIG.openWeatherMapKey,
    units: "imperial"
  });

  const data = await fetchJson(url);
  const list = data.list.slice(0, 8);
  const hourly = expandThreeHourData(list.map((entry) => ({
    time: entry.dt_txt,
    temp: entry.main.temp,
    feelsLike: entry.main.feels_like,
    humidity: entry.main.humidity,
    wind: entry.wind.speed,
    precip: Number(entry.pop) * 100,
    condition: entry.weather[0].description,
    icon: descToIcon(entry.weather[0].description)
  })));

  return {
    name: "OpenWeatherMap",
    current: hourly[0],
    hourly,
    daily: groupHourlyIntoDaily(hourly)
  };
}

async function fetchWeatherApi(place) {
  if (!CONFIG.weatherApiKey) return null;
  const url = new URL("https://api.weatherapi.com/v1/forecast.json");
  url.search = new URLSearchParams({
    key: CONFIG.weatherApiKey,
    q: `${place.latitude},${place.longitude}`,
    days: "3",
    aqi: "no",
    alerts: "no"
  });

  const data = await fetchJson(url);
  return {
    name: "WeatherAPI.com",
    current: {
      temp: data.current.temp_f,
      feelsLike: data.current.feelslike_f,
      humidity: data.current.humidity,
      wind: data.current.wind_mph,
      precip: data.forecast.forecastday[0].day.daily_chance_of_rain,
      condition: data.current.condition.text,
      icon: descToIcon(data.current.condition.text)
    },
    hourly: data.forecast.forecastday.flatMap((day) => day.hour.map((entry) => ({
      time: entry.time,
      temp: entry.temp_f,
      feelsLike: entry.feelslike_f,
      humidity: entry.humidity,
      wind: entry.wind_mph,
      precip: entry.chance_of_rain,
      condition: entry.condition.text,
      icon: descToIcon(entry.condition.text)
    }))).slice(0, 24),
    daily: data.forecast.forecastday.slice(0, 3).map((day) => ({
      date: day.date,
      high: day.day.maxtemp_f,
      low: day.day.mintemp_f,
      precip: day.day.daily_chance_of_rain,
      condition: day.day.condition.text,
      icon: descToIcon(day.day.condition.text)
    }))
  };
}

function mergeSources(sources) {
  const current = {
    temp: average(sources.map((source) => source.current?.temp)),
    feelsLike: average(sources.map((source) => source.current?.feelsLike)),
    humidity: average(sources.map((source) => source.current?.humidity)),
    wind: average(sources.map((source) => source.current?.wind)),
    precip: average(sources.map((source) => source.current?.precip)),
    condition: mostCommon(sources.map((source) => source.current?.condition)),
    icon: mostCommon(sources.map((source) => source.current?.icon))
  };

  const hourly = Array.from({ length: 24 }, (_, hourIndex) => {
    const entries = sources.map((source) => source.hourly?.[hourIndex]).filter(Boolean);
    return {
      time: entries[0]?.time,
      temp: average(entries.map((entry) => entry.temp)),
      feelsLike: average(entries.map((entry) => entry.feelsLike)),
      humidity: average(entries.map((entry) => entry.humidity)),
      wind: average(entries.map((entry) => entry.wind)),
      precip: average(entries.map((entry) => entry.precip)),
      condition: mostCommon(entries.map((entry) => entry.condition)),
      icon: mostCommon(entries.map((entry) => entry.icon))
    };
  });

  const daily = Array.from({ length: 3 }, (_, dayIndex) => {
    const entries = sources.map((source) => source.daily?.[dayIndex]).filter(Boolean);
    return {
      date: entries[0]?.date,
      high: average(entries.map((entry) => entry.high)),
      low: average(entries.map((entry) => entry.low)),
      precip: average(entries.map((entry) => entry.precip)),
      condition: mostCommon(entries.map((entry) => entry.condition)),
      icon: mostCommon(entries.map((entry) => entry.icon))
    };
  });

  return { current, hourly, daily };
}

function renderWeather(place, data, sources) {
  elements.updatedAt.textContent = `Last updated ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  elements.currentIcon.textContent = data.current.icon || "◌";
  elements.currentTemp.textContent = `${round(data.current.temp)}°F`;
  elements.currentFeelsLike.textContent = `Feels like ${round(data.current.feelsLike)}°F`;
  elements.currentCondition.textContent = titleCase(data.current.condition || "Forecast available");
  elements.currentWind.textContent = `${round(data.current.wind)} mph`;
  elements.currentHumidity.textContent = `${round(data.current.humidity)}%`;
  elements.currentPrecip.textContent = `${round(data.current.precip)}%`;
  elements.sourceSummary.textContent = sources.map((source) => source.name).join(", ");

  elements.hourlyForecast.innerHTML = data.hourly.map((hour) => `
    <article class="hour-card">
      <time>${formatHour(hour.time)}</time>
      <span class="small-icon" aria-hidden="true">${hour.icon || "◌"}</span>
      <p><strong>${round(hour.temp)}°</strong> ${titleCase(hour.condition || "")}</p>
      <p class="detail">Wind ${round(hour.wind)} mph</p>
      <p class="detail">Humidity ${round(hour.humidity)}%</p>
    </article>
  `).join("");

  elements.dailyForecast.innerHTML = data.daily.map((day) => `
    <article class="day-card">
      <div class="day-top">
        <time>${formatDay(day.date)}</time>
        <span class="small-icon" aria-hidden="true">${day.icon || "◌"}</span>
      </div>
      <p class="range">${round(day.high)}° / ${round(day.low)}°</p>
      <p>${titleCase(day.condition || "Forecast")}</p>
      <p class="detail">Precipitation chance ${round(day.precip)}%</p>
    </article>
  `).join("");
}

function clearForecasts() {
  elements.hourlyForecast.innerHTML = "";
  elements.dailyForecast.innerHTML = "";
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Weather source failed with status ${response.status}.`);
  }
  return response.json();
}

function setStatus(message) {
  elements.status.textContent = message;
}

function codeToCondition(code) {
  return weatherCodes[code]?.[0] || "Forecast";
}

function codeToIcon(code) {
  return weatherCodes[code]?.[1] || "◌";
}

function symbolToCondition(symbol) {
  return symbol.replace(/_/g, " ").replace(/\bday\b|\bnight\b/g, "").trim() || "Forecast";
}

function symbolToIcon(symbol) {
  if (/thunder/.test(symbol)) return "⛈";
  if (/snow|sleet/.test(symbol)) return "❄";
  if (/rain/.test(symbol)) return "🌧";
  if (/cloud|fair/.test(symbol)) return "☁";
  if (/clear/.test(symbol)) return "☀";
  return "◌";
}

function descToIcon(description) {
  const match = wttrIconMap.find(([pattern]) => pattern.test(description));
  return match?.[1] || "◌";
}

function average(values) {
  const numbers = values.filter((value) => Number.isFinite(Number(value))).map(Number);
  if (!numbers.length) return 0;
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function maxNumber(values) {
  const numbers = values.filter((value) => Number.isFinite(Number(value)));
  return numbers.length ? Math.max(...numbers) : 0;
}

function mostCommon(values) {
  const counts = new Map();
  values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}

function round(value) {
  return Math.round(Number(value) || 0);
}

function cToF(value) {
  return (Number(value) * 9 / 5) + 32;
}

function mpsToMph(value) {
  return Number(value) * 2.23694;
}

function calculateFeelsLike(tempF, humidity, windMph) {
  const temp = Number(tempF);
  const relativeHumidity = Number(humidity);
  const wind = Number(windMph);

  if (!Number.isFinite(temp)) return tempF;

  if (temp >= 80 && Number.isFinite(relativeHumidity)) {
    return -42.379
      + (2.04901523 * temp)
      + (10.14333127 * relativeHumidity)
      - (0.22475541 * temp * relativeHumidity)
      - (0.00683783 * temp * temp)
      - (0.05481717 * relativeHumidity * relativeHumidity)
      + (0.00122874 * temp * temp * relativeHumidity)
      + (0.00085282 * temp * relativeHumidity * relativeHumidity)
      - (0.00000199 * temp * temp * relativeHumidity * relativeHumidity);
  }

  if (temp <= 50 && wind > 3) {
    return 35.74 + (0.6215 * temp) - (35.75 * Math.pow(wind, 0.16)) + (0.4275 * temp * Math.pow(wind, 0.16));
  }

  return temp;
}

function formatHour(value) {
  if (!value) return "--";
  return new Date(value).toLocaleTimeString([], { hour: "numeric" });
}

function formatDay(value) {
  if (!value) return "Day";
  return new Date(`${value}T12:00:00`).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function titleCase(value) {
  return String(value)
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function timeFromWttr(date, time) {
  const padded = String(time).padStart(4, "0");
  return `${date}T${padded.slice(0, 2)}:${padded.slice(2)}:00`;
}

function expandThreeHourData(entries) {
  return entries.flatMap((entry, index) => {
    if (index === entries.length - 1) return [entry];
    const next = entries[index + 1];
    return [0, 1, 2].map((offset) => ({
      ...entry,
      time: addHours(entry.time, offset),
      temp: interpolate(entry.temp, next.temp, offset / 3),
      feelsLike: interpolate(entry.feelsLike, next.feelsLike, offset / 3),
      humidity: interpolate(entry.humidity, next.humidity, offset / 3),
      wind: interpolate(entry.wind, next.wind, offset / 3),
      precip: interpolate(entry.precip, next.precip, offset / 3)
    }));
  });
}

function addHours(value, hours) {
  const date = new Date(value);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

function interpolate(a, b, ratio) {
  if (!Number.isFinite(Number(a))) return b;
  if (!Number.isFinite(Number(b))) return a;
  return Number(a) + ((Number(b) - Number(a)) * ratio);
}

function groupHourlyIntoDaily(hourly) {
  const groups = new Map();
  hourly.forEach((entry) => {
    const date = new Date(entry.time).toISOString().slice(0, 10);
    groups.set(date, [...(groups.get(date) || []), entry]);
  });

  return [...groups.entries()].slice(0, 3).map(([date, entries]) => ({
    date,
    high: maxNumber(entries.map((entry) => entry.temp)),
    low: Math.min(...entries.map((entry) => entry.temp).filter((value) => Number.isFinite(Number(value)))),
    precip: maxNumber(entries.map((entry) => entry.precip)),
    condition: mostCommon(entries.map((entry) => entry.condition)),
    icon: mostCommon(entries.map((entry) => entry.icon))
  }));
}
