import { userInfo } from "os";
import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";
import { User } from "src/lib/db/schema";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  if (!(cmdName in registry)) {
    throw new Error("command doesnt exist in registry");
  }
  await registry[cmdName](cmdName, ...args);
}

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName, ...args) => {

    const currentUser = readConfig().currentUserName;

    const user = await getUser(currentUser);

    if (!user) {
      throw new Error(`User ${currentUser} not found`);
    }
    await handler(cmdName, user, ...args);
  };
}
