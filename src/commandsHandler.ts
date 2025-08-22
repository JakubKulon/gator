import { setUser } from "./config";

type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error(
      "the login handler expects a single argument, the username"
    );
  }

  setUser(args[0]);

  console.log(`user ${args[0]} has been set`);
}

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  if (!(cmdName in registry)) {
    throw new Error("command doesnt exist in registry");
  }
  registry[cmdName](cmdName, ...args);
}
