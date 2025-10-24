// ===== List of cities =====
const places = [
    { name: "Stockholm", lat: 59.329468, lon: 18.062639 },
    { name: "Uppsala", lat: 59.8586, lon: 17.6389 },
    { name: "Gotland", lat: 57.636, lon: 18.294 },
    { name: "Umeå", lat: 63.8258, lon: 20.263 },
];
// ===== Background images for each city =====
const cityBackgrounds = {
    Stockholm: "./pictures/stockholm.png",
    Uppsala: "./pictures/uppsala.png",
    Gotland: "./pictures/gotland.png",
    Umeå: "./pictures/umea.png",
};
// ===== SMHI weather symbols  =====
const weatherSymbols = {
    1: "Clear sky",
    2: "Nearly clear sky",
    3: "Variable cloudiness",
    4: "Half clear sky",
    5: "Cloudy sky",
    6: "Overcast",
    7: "Fog",
    8: "Light rain showers",
    9: "Moderate rain showers",
    10: "Heavy rain showers",
    11: "Thunderstorm",
    12: "Light sleet showers",
    13: "Moderate sleet showers",
    14: "Heavy sleet showers",
    15: "Light snow showers",
    16: "Moderate snow showers",
    17: "Heavy snow showers",
    18: "Light rain",
    19: "Moderate rain",
    20: "Heavy rain",
    21: "Thunder",
    22: "Light sleet",
    23: "Moderate sleet",
    24: "Heavy sleet",
    25: "Light snowfall",
    26: "Moderate snowfall",
    27: "Heavy snowfall",
};
// ===== Track the current city being displayed =====
let currentIndex = 0;
// ===== Updates city background =====
const updateBackgroundImage = (cityName) => {
    const img = document.querySelector("#imagePattern image");
    console.log(cityBackgrounds[cityName]);
    if (img) {
        img.setAttribute("href", cityBackgrounds[cityName]);
    }
};
// ===== Fetch weather data =====
async function fetchWeather(place) {
    const weatherURL = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${place.lon}/lat/${place.lat}/data.json`;
    try {
        // --- Fetch data from SMHI API ---
        const response = await fetch(weatherURL);
        if (!response.ok)
            throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        // --- Extract current weather data ---
        const airTempParam = data.timeSeries[0].parameters.find((p) => p.name === "t");
        const symbolParam = data.timeSeries[0].parameters.find((p) => p.name === "Wsymb2");
        const currentWeather = {
            airTemp: Math.round(airTempParam.values[0]),
            condition: symbolParam.values[0],
            validTime: data.timeSeries[0].validTime,
        };
        // --- Get readable condition name ---
        const actualCondition = weatherSymbols[currentWeather.condition] || "N/A";
        // --- Group forecast data by day ---
        const groupedByDate = {};
        data.timeSeries.forEach((entry) => {
            const vt = entry.validTime;
            if (!vt)
                return;
            const dateKey = vt.slice(0, 10);
            const t = entry.parameters.find((p) => p.name === "t")?.values?.[0];
            const sym = entry.parameters.find((p) => p.name === "Wsymb2")?.values?.[0];
            if (t === undefined || sym === undefined)
                return;
            (groupedByDate[dateKey] ?? (groupedByDate[dateKey] = { temps: [], symbol: sym })).temps.push(t);
        });
        // --- Create a simplified daily forecast array ---
        const dailyForecast = Object.entries(groupedByDate)
            .map(([date, info]) => ({
            date,
            minTemp: Math.round(Math.min(...info.temps)),
            maxTemp: Math.round(Math.max(...info.temps)),
            condition: info.symbol,
        }))
            .slice(1, 6); // Only keep next 5 days
        // --- Update the DOM to match the new layout ---
        const card = document.querySelector(".card");
        if (!card)
            return;
        // --- Update the upper part ---
        const temperatureEl = card.querySelector(".temperature");
        const locationEl = card.querySelector(".location");
        const conditionEl = card.querySelector(".condition");
        const iconEl = card.querySelector(".weather-icon");
        const sunriseEl = card.querySelector(".sun-info p:first-child");
        const sunsetEl = card.querySelector(".sun-info p:last-child");
        // --- Fill in live weather data ---
        if (temperatureEl)
            temperatureEl.innerHTML = `${currentWeather.airTemp}<span>°C</span>`;
        if (locationEl)
            locationEl.textContent = place.name;
        if (conditionEl)
            conditionEl.textContent = actualCondition;
        if (iconEl)
            iconEl.src = `./weather_icons/aligned/solid/day/${String(currentWeather.condition).padStart(2, "0")}.svg`;
        // --- Update the 5-day forecast section ---
        const forecastContainer = card.querySelector(".forecast");
        if (forecastContainer) {
            forecastContainer.innerHTML = ""; // Clear old data
            const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            // --- Generate HTML for each forecast day ---
            dailyForecast.forEach((day) => {
                const date = new Date(day.date);
                const weekday = weekdays[date.getDay()];
                const dayHTML = `
                    <div class="day">
                        <p class="day-name">${weekday}</p>
                        <img
                            src="./weather_icons/aligned/solid/day/${String(day.condition).padStart(2, "0")}.svg"
                            class="day-icon"
                            alt="${weatherSymbols[day.condition] || ""}"
                        />
                        <p class="day-temp">${day.maxTemp}° / ${day.minTemp}°C</p>
                    </div>
                    `;
                forecastContainer.innerHTML += dayHTML;
            });
        }
        // --- Display the time and date in the DOM ---
        const timeContainer = document.querySelector('.time');
        const displayTime = () => {
            const now = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            const formattedTime = now.toLocaleDateString('en-US', options);
            timeContainer.innerHTML = '';
            timeContainer.innerHTML = `
            <p>${formattedTime}</p>
            `;
        };
        displayTime();
    }
    catch (error) {
        console.error(`Error fetching weather for ${place.name}:`, error);
    }
}
// ===== Fetch weather for the first city on load =====
fetchWeather(places[currentIndex]);
// ===== Switch to the next city when button is clicked =====
function nextCity() {
    currentIndex = (currentIndex + 1) % places.length;
    const place = places[currentIndex];
    console.log(place.name);
    fetchWeather(place);
    updateBackgroundImage(place.name);
}
// ===== Connect the button click event =====
document.getElementById("toggle-button")?.addEventListener("click", nextCity);
export {};
//# sourceMappingURL=index.js.map