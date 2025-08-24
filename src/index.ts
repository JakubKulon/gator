import {
  handlerLogin,
  handlerRegister,
  handleReset,
  handleUsers,
} from "./commands/commands";
import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commandsHandler";

async function main() {
  const commandRegistry: CommandsRegistry = {};

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("there wasnt pass any argument");
    process.exit(1);
  }

  registerCommand(commandRegistry, "login", handlerLogin);
  registerCommand(commandRegistry, "register", handlerRegister);
  registerCommand(commandRegistry, "reset", handleReset);
  registerCommand(commandRegistry, "users", handleUsers);

  try {
    await runCommand(commandRegistry, args[0], ...args.slice(1));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  process.exit(0);
}

await main();
