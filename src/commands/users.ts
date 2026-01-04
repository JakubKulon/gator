import { getUsers } from "../lib/db/queries/users";
import { readConfig } from "../config";

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
