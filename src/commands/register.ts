import { getUser, createUser } from "../lib/db/queries/users";
import { setUser } from "../config";

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
}
