import { getUser } from "../lib/db/queries/users";
import { setUser } from "../config";

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
