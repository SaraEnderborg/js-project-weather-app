
type place = {
    name: string,
    lat: number,
    lon: number
}

type weatherData = {
    airTemp: number,
    condition: string
}

type forecastItem = {
    forecastAirTemp: number,
    forecastCondition: string
}

const places: any = [
    { name: 'oslo', lat: 59.913245, lon: 59.913245 },
    { name: 'stockholm', lat: 59.329468, lon: 18.062639 }
];
const weatherURL = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?timeseries=24`;

const weatherSymbols = {
    1: "Clear sky",
    2: "Nearly clear sky",
    3: "Variable cloudiness",
    4: "Halfclear sky",
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
    27: "Heavy snowfall"
};


let currentWeather: weatherData | null = null
let forecastWeather: forecastItem[] = [];


async function fetchWeather(): Promise<void> {
    try {
        const response = await fetch(weatherURL);
        if (!response.ok)
            throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();

        currentWeather = {
            airTemp: Math.round(data.timeSeries[0].data.air_temperature),
            condition: data.timeSeries[0].data.symbol_code
        }; 

        forecastWeather = [{
            forecastAirTemp: Math.round(data.timeSeries[23].data.air_temperature),
            forecastCondition: data.timeSeries[23].data.symbol_code
        }]; 

          // a way to get a hold of the actually meaning of the weather symbols (found in the docs)
        const actualCondition = weatherSymbols[Number(currentWeather.condition)] || 'Unknown';
        
        console.log('airTemp', currentWeather.airTemp);
        console.log('condition', currentWeather.condition);
        console.log('actualCondition', actualCondition);
        console.log(`location: ${places[1].name}, lat: ${places[1].lat}, lon: ${places[1].lon}`);
        console.log('data', data);
        console.log('forecast data', data.timeSeries);


        // display the temperature in the DOM
        const degreesContainer = document.querySelector('.degrees');
        const displayDegrees = (array: any) => {
            degreesContainer.innerHTML = '';
            degreesContainer.innerHTML = `
            <h1>${currentWeather.airTemp}</h1>
            <h2>°c</h2>
            `;
        };
        displayDegrees(currentWeather);

        // display the weather condition in the DOM
        const conditionContainer = document.querySelector('.condition');
        const displayCondition = (condition: any) => {
            conditionContainer.innerHTML = '';
            conditionContainer.innerHTML = `
            <h3>${actualCondition}</h3>
            <img 
                src="./weather_icons/aligned/solid/day/${String(currentWeather.condition).padStart(2, '0')}.svg" 
                class="weather-icon"
                alt="weather-icon">
            `;
        };
        displayCondition(currentWeather.condition);

        // display the location in the DOM
        const locationContainer = document.querySelector('.location');
        const displayLocation = (place: any) => {
            locationContainer.innerHTML = '';
            locationContainer.innerHTML = `
            <h2>${places[1].name.charAt(0).toUpperCase() + places[1].name.slice(1)}</h2>
            `;
        }
        displayLocation(places[1].name);

        // display the forecast icons in the DOM
        const forecastIconContainer = document.querySelector('.forecast');
        const displayForecastIcon = (items:forecastItem[]) => {
            forecastIconContainer.innerHTML = '';
            // loop through the forecastWeather array and display each item
            items.forEach((item: any) => {
                forecastIconContainer.innerHTML += `
                <div class="forecast-icons">
                    <img 
                        src="./weather_icons/aligned/solid/day/${String(item.forecastCondition).padStart(2, '0')}.svg" 
                        class="weather-icon-forecast"
                        alt="weather-icon-forecast">
                </div>
                `;
            });
        };
        displayForecastIcon(forecastWeather);

        }
        catch (error) {
        console.log(`Error caught, ${error}`);

        console.log(currentWeather);
        console.log(forecastWeather);
    }
};    
fetchWeather();

// get today's date
const today = new Date();
console.log('today', today);

