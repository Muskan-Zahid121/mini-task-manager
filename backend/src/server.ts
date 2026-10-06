import { createApp } from "./app";
import { sequelize } from "./config/database";
import { env } from "./config/env";

async function main(): Promise<void> {
  await sequelize.authenticate();
  console.log("Database connection established");

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
