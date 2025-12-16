# OpenWeather MCP Server

A Model Context Protocol (MCP) server that provides weather data using the OpenWeather One Call API 3.0.

This server allows AI agents (like Claude Desktop) to access current weather, forecasts, and historical weather data for any location.

## Features

- **Current & Forecast**: Get detailed current weather and daily/hourly forecasts.
- **Time Machine**: Retrieve historical weather data for specific timestamps.
- **Geocoding**: Built-in tool to search for locations by name (e.g., "London", "Tokyo").
- **Local Execution**: Runs locally via Stdio, keeping your API keys secure on your machine.

## Prerequisites

- **Node.js**: Version 16 or higher.
- **OpenWeather API Key**: You need a key with "One Call API 3.0" subscription. [Get one here](https://openweathermap.org/api/one-call-3).

## Installation

### Option 1: Run from Source (Recommended for Developers)

1.  Clone this repository:
    ```bash
    git clone https://github.com/your-username/openweather-mcp.git
    cd openweather-mcp
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the project:
    ```bash
    npm run build
    ```

## Configuration (Zero-Config Method)

Once published to NPM, users can run the server without manually downloading code or configuring paths using `npx`.

```json
{
  "mcpServers": {
    "openweather": {
      "command": "npx",
      "args": [
        "-y",
        "openweather-mcp"
      ],
      "env": {
        "OPENWEATHER_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Development Configuration

If running locally from source:

```json
{
  "mcpServers": {
    "openweather": {
      "command": "node",
      "args": [
        "C:/Absolute/Path/To/openweather-mcp/dist/index.js"
      ],
      "env": {
        "OPENWEATHER_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Tools

### `get_current_weather`
Fetch current weather and forecast for a location.
- **Args**: `lat` (number), `lon` (number), `exclude` (array, optional)

### `get_weather_history`
Fetch historical weather for a specific time.
- **Args**: `lat` (number), `lon` (number), `dt` (unix timestamp)

### `search_location`
Search for a city/location to get coordinates.
- **Args**: `query` (string)

## License

MIT
