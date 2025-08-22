import {
  CommandsRegistry,
  handlerLogin,
  registerCommand,
  runCommand,
} from "./commandsHandler";
import { readConfig } from "./config";

function main() {
  const commandRegistry: CommandsRegistry = {};

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("there wasnt pass any argument");
    process.exit(1);
  }

  registerCommand(commandRegistry, "login", handlerLogin);
  runCommand(commandRegistry, args[0], ...args.slice(1));
}

main();
