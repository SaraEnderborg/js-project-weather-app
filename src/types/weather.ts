export type Place = {
  name: string;
  lat: number;
  lon: number;
}

export type ForecastEntry = {
  time: string;
  temp: number;
  symbol: number;
}

export type ForecastDay = {
  date: string;
  temp: number;
  symbol: number;
}

export type WeatherSymbols = Record<number, string>