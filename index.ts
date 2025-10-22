
type place = {
    name: string,
    lat: number,
    lon: number,
    url: string
}

type weatherData = {
    airTemp: number,
    condition: string,
    validTime: string
}

type forecastItem = {
    forecastAirTemp: number,
    forecastCondition: string,
    validTime: string
}

const places: any = [
    { 
        name: 'stockholm', 
        lat: 59.329468, 
        lon: 18.062639,
        url: `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json`
    }
    { 
        name: 'gotland', 
        lat: 57.499998,  
        lon: 18.549997,
        url: `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.5499978/lat/57.49999/data.json`
    },
    { 
        name: 'umeå', 
        lat: 63.825848, 
        lon: 20.263035,
        url: `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/20.263035/lat/63.825848/data.json`
    },
    { 
        name: 'uppsala', 
        lat: 59.856701,
        lon: 17.642139,
        url: `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/17.642139/lat/59.856701/data.json`
    }]
;
// const weatherURL = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?timeseries=24`;
const weatherURL = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json`;

const hourIndex = 0; // index for current weather data (0 hours ahead)  

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

        // get forecast for 5 days later
        // e.g. 24, 48, 72, 96, 120 hours later
        forecastWeather = [24, 48, 72].map((hoursAhead) => {
            const item = data.timeSeries[hoursAhead];
            console.log('item', item);

            return {
                forecastAirTemp: Math.round(item.data.air_temperature),
                forecastCondition: item.data.symbol_code,
                validTime: item.validTime
            };
        });

          // a way to get a hold of the actually meaning of the weather symbols (found in the docs)
        const actualCondition = weatherSymbols[Number(currentWeather.condition)] || 'Unknown';
        
        console.log('airTemp', currentWeather.airTemp);
        console.log('condition', currentWeather.condition);
        console.log('actualCondition', actualCondition);
        console.log(`location: ${places[1].name}, lat: ${places[1].lat}, lon: ${places[1].lon}`);
        console.log('data', data);
        console.log('forecast data', data.timeSeries);
        console.log(currentWeather);
        console.log(forecastWeather);


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
            <h2>${places[0].name.charAt(0).toUpperCase() + places[0].name.slice(1)}</h2>
            `;
        }
        displayLocation(places[0].name);

        // display the forecast icons in weekdays in the DOM
        const forecastIconContainer = document.querySelector('.weather-icons');
        const displayForecastIcons = (items:forecastItem[]) => {
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
        displayForecastIcons(forecastWeather);

        // display forecast temperatures in the DOM
        const forecastTempContainer = document.querySelector(".temp");
        const displayForecastTemps = (items:forecastItem[]) => {
            forecastTempContainer.innerHTML = '';
            // loop through the forecastWeather array and display each item
            items.forEach((item: any) => {
                forecastTempContainer.innerHTML += `
                <div class="forecast-temps-item">
                    <p>${item.forecastAirTemp}°c</p>
                </div>
                `;
            }); 
        };
        displayForecastTemps(forecastWeather);

        }
        catch (error) {
        console.log(`Error caught, ${error}`);
        }
};    
fetchWeather();

// get today's date
const today = new Date();
console.log('today', today);




/////////////////////////////////////////////////////////////////////////


// display stockholm weather
async function displayStockholmWeather() {
    try {
        const response = await fetch(places[0].url);
        if (!response.ok)
            throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();

        const stockholmWeather = {
            airTemp: Math.round(data.timeSeries[hourIndex].data.air_temperature),
            condition: data.timeSeries[hourIndex].data.symbol_code
        };

        console.log(`Stockholm weather: ${stockholmWeather.airTemp}°C, Condition: ${stockholmWeather.condition}`);
    } catch (error) {
        console.log(`Error caught, ${error}`);
    }
}
displayStockholmWeather();


// display gotland weather
async function displayGotlandWeather() {
    try {
        const response = await fetch(places[0].url);
        if (!response.ok)
            throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();

        const gotlandWeather = {
            airTemp: Math.round(data.timeSeries[hourIndex].data.air_temperature),
            condition: data.timeSeries[hourIndex].data.symbol_code
        };

        console.log(`Gotland weather: ${gotlandWeather.airTemp}°C, Condition: ${gotlandWeather.condition}`);
    } catch (error) {
        console.log(`Error caught, ${error}`);
    }
}
displayGotlandWeather();


// display umeå weather
async function displayUmeaWeather() {
    try {
        const response = await fetch(places[2].url);
        if (!response.ok)
            throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();

        const umeaWeather = {
            airTemp: Math.round(data.timeSeries[hourIndex].data.air_temperature),
            condition: data.timeSeries[hourIndex].data.symbol_code
        };

        console.log(`Umeå weather: ${umeaWeather.airTemp}°C, Condition: ${umeaWeather.condition}`);
    } catch (error) {
        console.log(`Error caught, ${error}`);
    }
}
displayUmeaWeather();



// display uppsala weather
async function displayUppsalaWeather() {
    try {
        const response = await fetch(places[3].url);
        if (!response.ok)
            throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();

        const uppsalaWeather = {
            airTemp: Math.round(data.timeSeries[hourIndex].data.air_temperature),
            condition: data.timeSeries[hourIndex].data.symbol_code
        };

        console.log(`Uppsala weather: ${uppsalaWeather.airTemp}°C, Condition: ${uppsalaWeather.condition}`);
    } catch (error) {
        console.log(`Error caught, ${error}`);
    }
}
displayUppsalaWeather();


