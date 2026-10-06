import { execSync } from "child_process";

const sequelizeCli = "tsx node_modules/sequelize-cli/lib/sequelize";

function run(command: string): void {
  console.log(`> ${command}`);
  execSync(command, { stdio: "inherit" });
}

run(`${sequelizeCli} db:drop`);
run(`${sequelizeCli} db:create`);
run(`${sequelizeCli} db:migrate`);
run(`${sequelizeCli} db:seed:all`);

console.log("Database reset complete");
