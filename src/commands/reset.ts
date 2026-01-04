import { resetUsers } from "../lib/db/queries/general";

export async function handleReset(_cmdName: string, ...args: string[]) {
    await resetUsers();

    console.log("All users has been reseted");
}
