import axios from "axios";

const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/3.0/onecall";
const GEOCODING_BASE_URL = "http://api.openweathermap.org/geo/1.0/direct";

export interface WeatherData {
    lat: number;
    lon: number;
    timezone: string;
    current?: {
        dt: number;
        temp: number;
        feels_like: number;
        pressure: number;
        humidity: number;
        uvi: number;
        weather: { id: number; main: string; description: string; icon: string }[];
    };
    hourly?: any[]; // Simplified for now
    daily?: {
        dt: number;
        temp: { min: number; max: number; day: number; night: number };
        weather: { id: number; main: string; description: string }[];
    }[];
    alerts?: any[];
}

export class OpenWeatherClient {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async getOneCall(lat: number, lon: number, exclude?: string[]): Promise<WeatherData> {
        try {
            const response = await axios.get(OPENWEATHER_BASE_URL, {
                params: {
                    lat,
                    lon,
                    exclude: exclude?.join(","),
                    appid: this.apiKey,
                    units: "metric", // Default to metric
                },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`OpenWeather API error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }

    async getTimeMachine(lat: number, lon: number, dt: number): Promise<WeatherData> {
        try {
            const response = await axios.get(`${OPENWEATHER_BASE_URL}/timemachine`, {
                params: {
                    lat,
                    lon,
                    dt,
                    appid: this.apiKey,
                    units: "metric",
                },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`OpenWeather API error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }

    async getDaySummary(lat: number, lon: number, date: string): Promise<any> {
        try {
            const response = await axios.get(`${OPENWEATHER_BASE_URL}/day_summary`, {
                params: {
                    lat,
                    lon,
                    date,
                    appid: this.apiKey,
                    units: "metric",
                },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`OpenWeather API error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }

    async searchLocation(query: string, limit: number = 5): Promise<any[]> {
        try {
            const response = await axios.get(GEOCODING_BASE_URL, {
                params: {
                    q: query,
                    limit,
                    appid: this.apiKey,
                },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`OpenWeather API error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }
}
