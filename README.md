# OpenWeather MCP Server

一个基于 Model Context Protocol (MCP) 的服务器，使用 OpenWeather One Call API 3.0 提供天气数据。该服务器允许 AI 智能体（如 Claude Desktop）获取任何地点的当前天气、天气预报和历史天气数据。

A Model Context Protocol (MCP) server that provides weather data using the OpenWeather One Call API 3.0. This server allows AI agents (like Claude Desktop) to access current weather, forecasts, and historical weather data for any location.

## 功能特性 | Features

- **当前天气与预报 | Current & Forecast**: 获取详细的当前天气状况和每日/每小时天气预报。Get detailed current weather and daily/hourly forecasts.
- **时间机器 | Time Machine**: 获取特定时间戳的历史天气数据。Retrieve historical weather data for specific timestamps.
- **地理编码 | Geocoding**: 内置工具，支持按名称（如"伦敦"、"东京"）搜索地点。Built-in tool to search for locations by name (e.g., "London", "Tokyo").
- **本地执行 | Local Execution**: 通过 Stdio 本地运行，确保您的 API 密钥安全保存在本地机器上。Runs locally via Stdio, keeping your API keys secure on your machine.

## 先决条件 | Prerequisites

- **Node.js**: 版本 16 或更高。Version 16 or higher.
- **OpenWeather API 密钥 | OpenWeather API Key**: 需要一个具有 "One Call API 3.0" 订阅的密钥。[在此获取](https://openweathermap.org/api/one-call-3)。You need a key with "One Call API 3.0" subscription. [Get one here](https://openweathermap.org/api/one-call-3).

## 安装 | Installation

### 选项 1: 从源码运行（推荐给开发者） | Option 1: Run from Source (Recommended for Developers)

1.  **克隆此仓库 | Clone this repository**:
    ```bash
    git clone https://github.com/your-username/openweather-mcp.git
    cd openweather-mcp
    ```

2.  **安装依赖 | Install dependencies**:
    ```bash
    npm install
    ```

3.  **构建项目 | Build the project**:
    ```bash
    npm run build
    ```

## 配置 | Configuration

### 零配置方法（发布到 NPM 后可用） | Zero-Config Method (Available after publishing to NPM)

发布到 NPM 后，用户可以使用 `npx` 运行服务器，无需手动下载代码或配置路径。

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

### 开发配置 | Development Configuration

如果从源码本地运行：

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

## 工具 | Tools

### `get_current_weather`
获取指定地点的当前天气和预报。Fetch current weather and forecast for a location.
- **参数 | Args**: `lat`（数字，纬度 | number），`lon`（数字，经度 | number），`exclude`（数组，可选 | array, optional）

### `get_weather_history`
获取特定时间的历史天气。Fetch historical weather for a specific time.
- **参数 | Args**: `lat`（数字，纬度 | number），`lon`（数字，经度 | number），`dt`（Unix 时间戳 | unix timestamp）

### `search_location`
搜索城市/地点以获取坐标。Search for a city/location to get coordinates.
- **参数 | Args**: `query`（字符串，搜索查询 | string）

## 许可证 | License

MIT