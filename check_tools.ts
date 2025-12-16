import { spawn } from "child_process";
import path from "path";

const serverPath = path.resolve("./dist/index.js");

// Mock environment
const env = { ...process.env, OPENWEATHER_API_KEY: "test_key_verification" };

console.log("Starting server from:", serverPath);
const server = spawn("node", [serverPath], { env, stdio: ["pipe", "pipe", "inherit"] });

const sendRequest = (req: any) => {
    const json = JSON.stringify(req);
    server.stdin.write(json + "\n");
};

server.stdout.on("data", (data) => {
    const lines = data.toString().split("\n");
    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const response = JSON.parse(line);
            // console.log("Received:", JSON.stringify(response, null, 2)); // Verbose

            if (response.result && response.result.tools) {
                console.log(`[PASS] ListTools returned ${response.result.tools.length} tools.`);

                // Test search_location
                console.log("Testing search_location tool...");
                sendRequest({
                    jsonrpc: "2.0",
                    id: 2,
                    method: "tools/call",
                    params: {
                        name: "search_location",
                        arguments: { query: "London" }
                    }
                });
            } else if (response.id === 2) {
                // We expect an error or result. Since the key is fake, it might error, but the format should be valid.
                if (response.error) {
                    console.log("[PASS] search_location responded (API Error expected with fake key):", response.error.message || response.error);
                } else if (response.result && response.result.isError) {
                    // Our app returns error in content sometimes but isError flag is true
                    const text = response.result.content[0].text;
                    console.log("[PASS] search_location handled API error gracefully:", text);
                } else {
                    console.log("[PASS] search_location returned success (unexpected with fake key but protocol valid).");
                }
                server.kill();
                process.exit(0);
            }
        } catch (e) {
            // Ignore non-JSON
        }
    }
});

server.stderr.on("data", (data) => {
    console.error(`[Server Log] ${data}`);
});

server.on("close", (code) => {
    if (code !== 0 && code !== null) console.log(`Server exited with code ${code}`);
});

console.log("Sending tools/list...");
sendRequest({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list"
});

setTimeout(() => {
    console.error("Timeout.");
    server.kill();
    process.exit(1);
}, 5000);
