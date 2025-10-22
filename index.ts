
type place = {
    name: string,
    lat: number,
    lon: number
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
    { name: 'oslo', lat: 59.913245, lon: 59.913245 },
    { name: 'stockholm', lat: 59.329468, lon: 18.062639 }
];
const weatherURL = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?`;

const weatherSymbols:Record<number, string> = {
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

          console.log("data",data)

         currentWeather = {
            airTemp: Math.round(data.timeSeries[0].data.air_temperature),
            condition: data.timeSeries[0].data.symbol_code, validTime: data.timeSeries[0].validTime
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
        const actualCondition = weatherSymbols[Number(currentWeather?.condition)];
        
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
          if (degreesContainer) {
            degreesContainer.innerHTML = '';
            degreesContainer.innerHTML = `
            <h1>${currentWeather?.airTemp}</h1>
            <h2>°c</h2>
            `;
         }
        };
        displayDegrees(currentWeather);

        // display the weather condition in the DOM
        const conditionContainer = document.querySelector('.condition');
        const displayCondition = (condition: any) => {

          if (conditionContainer) {
            conditionContainer.innerHTML = '';
            conditionContainer.innerHTML = `
            <h3>${actualCondition}</h3>
            <img 
                src="./weather_icons/aligned/solid/day/${String(currentWeather?.condition).padStart(2, '0')}.svg" 
                class="weather-icon"
                alt="weather-icon">
            `;
          }
            
        };
        displayCondition(currentWeather.condition);

        // display the location in the DOM
        const locationContainer = document.querySelector('.location');
        const displayLocation = (place: any) => {
          if (locationContainer) {
              locationContainer.innerHTML = '';
            locationContainer.innerHTML = `
            <h2>${places[1].name.charAt(0).toUpperCase() + places[1].name.slice(1)}</h2>
            `;
          }
          
        }
        displayLocation(places[1].name);

        // display the forecast icons in weekdays in the DOM
        const forecastIconContainer = document.querySelector('.weather-icons');
        const displayForecastIcons = (items:forecastItem[]) => {
          if (!forecastIconContainer) {
    console.warn("⚠️ Element '.weather-icons' was not found in the DOM."); 
    return;
  }
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
          if (!forecastTempContainer) {
    console.warn("⚠️ Element '.temp' was not found in the DOM."); 
    return;
  }
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

