import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function authHttpOnlyDevPlugin(proxyTarget) {
  const targetUrl = (proxyTarget || "http://localhost:8000").replace(/\/$/, "");

  return {
    name: "auth-httponly-dev-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || "";

        // 1. Intercept Admin Login: POST /api/v1/auth/admin/login
        if (url.startsWith("/api/v1/auth/admin/login") && req.method === "POST") {
          let bodyChunks = [];
          req.on("data", (chunk) => bodyChunks.push(chunk));
          req.on("end", async () => {
            try {
              const bodyStr = Buffer.concat(bodyChunks).toString();
              const backendRes = await fetch(`${targetUrl}/api/v1/auth/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: bodyStr,
              });

              const backendData = await backendRes.json();
              const status = backendRes.status;

              if (backendData?.success && backendData?.data?.access_token) {
                const accessToken = backendData.data.access_token;
                const refreshToken = backendData.data.refresh_token;

                // Issue HTTP-Only cookies to browser!
                res.writeHead(status, {
                  "Content-Type": "application/json",
                  "Set-Cookie": [
                    `access_token=${accessToken}; Path=/; HttpOnly; SameSite=Lax`,
                    `refresh_token=${refreshToken}; Path=/; HttpOnly; SameSite=Lax`,
                    `signedIn=true; Path=/; SameSite=Lax`,
                  ],
                });
              } else {
                res.writeHead(status, { "Content-Type": "application/json" });
              }
              res.end(JSON.stringify(backendData));
            } catch (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }

        // 2. Intercept Token Refresh: POST /api/v1/auth/refresh
        if (url.startsWith("/api/v1/auth/refresh") && req.method === "POST") {
          let bodyChunks = [];
          req.on("data", (chunk) => bodyChunks.push(chunk));
          req.on("end", async () => {
            try {
              const bodyStr = Buffer.concat(bodyChunks).toString();
              let parsedBody = {};
              try {
                parsedBody = JSON.parse(bodyStr);
              } catch {}

              let refreshToken = parsedBody.refresh_token;
              if (!refreshToken) {
                const cookieHeader = req.headers.cookie || "";
                const match = cookieHeader.match(/(^|; )refresh_token=([^;]*)/);
                if (match) refreshToken = decodeURIComponent(match[2]);
              }

              const backendRes = await fetch(`${targetUrl}/api/v1/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token: refreshToken }),
              });

              const backendData = await backendRes.json();
              const status = backendRes.status;

              if (backendData?.success && backendData?.data?.access_token) {
                const newAccessToken = backendData.data.access_token;
                res.writeHead(status, {
                  "Content-Type": "application/json",
                  "Set-Cookie": [
                    `access_token=${newAccessToken}; Path=/; HttpOnly; SameSite=Lax`,
                  ],
                });
              } else {
                // Refresh failed: clear cookies
                res.writeHead(status, {
                  "Content-Type": "application/json",
                  "Set-Cookie": [
                    "access_token=; Path=/; HttpOnly; Max-Age=0",
                    "refresh_token=; Path=/; HttpOnly; Max-Age=0",
                    "signedIn=; Path=/; Max-Age=0",
                  ],
                });
              }
              res.end(JSON.stringify(backendData));
            } catch (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }

        // 3. Intercept Logout: POST /api/v1/auth/logout
        if (url.startsWith("/api/v1/auth/logout")) {
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Set-Cookie": [
              "access_token=; Path=/; HttpOnly; Max-Age=0",
              "refresh_token=; Path=/; HttpOnly; Max-Age=0",
              "signedIn=; Path=/; Max-Age=0",
            ],
          });
          res.end(JSON.stringify({ success: true, message: "Logged out successfully" }));
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget =
    env.VITE_API_PROXY_TARGET ||
    (mode === "production"
      ? env.VITE_API_BASE_URL_PROD
      : env.VITE_API_BASE_URL_DEV) ||
    "http://localhost:8000";

  return {
    plugins: [react(), tailwindcss(), authHttpOnlyDevPlugin(proxyTarget)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 9000,
      host: true,
      open: true,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            // Read incoming HttpOnly access_token cookie and forward as Authorization: Bearer
            proxy.on("proxyReq", (proxyReq, req) => {
              const cookieHeader = req.headers.cookie || "";
              const match = cookieHeader.match(/(^|; )access_token=([^;]*)/);
              if (match && !proxyReq.getHeader("authorization")) {
                proxyReq.setHeader(
                  "authorization",
                  `Bearer ${decodeURIComponent(match[2])}`
                );
              }
            });
          },
        },
        "/uploads": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});

