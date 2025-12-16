#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { OpenWeatherClient } from "./weather.js";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
    console.error("Error: OPENWEATHER_API_KEY environment variable is required.");
    process.exit(1);
}

const weatherClient = new OpenWeatherClient(API_KEY);

const server = new Server(
    {
        name: "openweather-mcp",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Define Tools
const GET_CURRENT_WEATHER_TOOL: Tool = {
    name: "get_current_weather",
    description: "Get current weather and forecast for a specific location (lat/lon). Returns current weather, daily forecast for 8 days, and hourly forecast for 48 hours.",
    inputSchema: {
        type: "object",
        properties: {
            lat: { type: "number", description: "Latitude" },
            lon: { type: "number", description: "Longitude" },
            exclude: {
                type: "array",
                items: { type: "string", enum: ["current", "minutely", "hourly", "daily", "alerts"] },
                description: "Parts of weather data to exclude"
            }
        },
        required: ["lat", "lon"],
    },
};

const GET_WEATHER_HISTORY_TOOL: Tool = {
    name: "get_weather_history",
    description: "Get historical weather data for a specific timestamp (Time Machine).",
    inputSchema: {
        type: "object",
        properties: {
            lat: { type: "number", description: "Latitude" },
            lon: { type: "number", description: "Longitude" },
            dt: { type: "number", description: "Timestamp (Unix time, UTC)" },
        },
        required: ["lat", "lon", "dt"],
    },
};

const SEARCH_LOCATION_TOOL: Tool = {
    name: "search_location",
    description: "Search for a location by name to get its coordinates (lat/lon).",
    inputSchema: {
        type: "object",
        properties: {
            query: { type: "string", description: "City name, state code (optional), country code (optional). E.g. 'London', 'New York, NY, US'" },
            limit: { type: "number", description: "Number of results to return (default 5)" }
        },
        required: ["query"]
    }
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [GET_CURRENT_WEATHER_TOOL, GET_WEATHER_HISTORY_TOOL, SEARCH_LOCATION_TOOL],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        if (name === "get_current_weather") {
            const schema = z.object({
                lat: z.number(),
                lon: z.number(),
                exclude: z.array(z.string()).optional()
            });
            const { lat, lon, exclude } = schema.parse(args);
            const data = await weatherClient.getOneCall(lat, lon, exclude);
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
            };
        }

        if (name === "get_weather_history") {
            const schema = z.object({
                lat: z.number(),
                lon: z.number(),
                dt: z.number()
            });
            const { lat, lon, dt } = schema.parse(args);
            const data = await weatherClient.getTimeMachine(lat, lon, dt);
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
            };
        }

        if (name === "search_location") {
            const schema = z.object({
                query: z.string(),
                limit: z.number().optional()
            });
            const { query, limit } = schema.parse(args);
            const data = await weatherClient.searchLocation(query, limit);
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
            }
        }

        throw new Error(`Unknown tool: ${name}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: "text", text: `Error: ${errorMessage}` }],
            isError: true,
        };
    }
});

async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("OpenWeather MCP Server running on stdio");
}

runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
