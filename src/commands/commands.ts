import { readConfig, setUser } from "../config";
import { resetUsers } from "../lib/db/queries/general";
import { getUser, createUser, getUsers } from "../lib/db/queries/users";

export async function handlerLogin(_cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error(
      "the login handler expects a single argument, the username"
    );
  }

  const response = await getUser(args[0]);
  if (!response) {
    throw new Error("user doesn't exist");
  }
  setUser(args[0]);

  console.log(`user ${args[0]} has been set`);
}

export async function handlerRegister(_cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error(
      "the register handler expects a single argument, the username name"
    );
  }

  const isUserExist = await getUser(args[0]);

  if (isUserExist) {
    throw new Error("user already exist, please provide diffrent name");
  }
  const response = await createUser(args[0]);
  setUser(response.name);

  console.log(`User ${response.name} has been created`);
  console.log(response);
}

export async function handleReset(_cmdName: string, ...args: string[]) {
  const res = await resetUsers();

  console.log(res);

  console.log("All users has been reseted");
}

export async function handleUsers() {
  const response = await getUsers();

  const currentUser = readConfig().currentUserName;

  const users = response.map((user) => {
    if (user.name === currentUser) {
      return `* ${user.name} (current)`;
    }
    return `* ${user.name}`;
  });
  console.log(users);
}
