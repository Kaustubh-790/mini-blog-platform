const cron = require("node-cron");
const https = require("https");

const keepAlive = () => {
  // Schedule task to run every 14 minutes
  cron.schedule("*/14 * * * *", () => {
    const backendUrl =
      process.env.BACKEND_URL || "https://mini-blog-platform-nzp4.onrender.com";

    if (process.env.NODE_ENV === "production" || process.env.BACKEND_URL) {
      console.log(
        `[KeepAlive] Pinging ${backendUrl}/api/health to prevent sleep...`
      );

      https
        .get(`${backendUrl}/api/health`, (res) => {
          if (res.statusCode === 200) {
            console.log(`[KeepAlive] Ping successful: ${res.statusCode}`);
          } else {
            console.warn(
              `[KeepAlive] Ping received non-200 status: ${res.statusCode}`
            );
          }
        })
        .on("error", (err) => {
          console.error(`[KeepAlive] Ping failed: ${err.message}`);
        });
    }
  });
};

module.exports = keepAlive;
