const URL = "https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?timeseries=24";
let currentWeather;
const fetchWeather = async () => {
    try {
        const response = await fetch(URL);
        if (!response.ok)
            throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        currentWeather = {
            airTemp: data.timeSeries[0].data.air_temperature,
            condition: data.timeSeries[0].data.symbol_code
        };
        console.log(currentWeather);
        currentWeather();
    }
    catch (error) {
        console.log(`Error caught, ${error}`);
        fetchWeather();
        // const degreesContainer = document.querySelector(".degrees")
        const degreesContainer = document.querySelector(".degrees");
        const displayDegrees = (airTemp) => {
            degreesContainer.innerHTML = `
    <h1>${airTemp}</h1>
    <h2>°C</h2>
  `;
        };
        displayDegrees(currentWeather.airTemp);
    }
    console.log(displayDegrees);
};
export {};
//# sourceMappingURL=index.js.map