import { getAllFeeds } from "src/lib/db/queries/feeds";
import { getUsers } from "../lib/db/queries/users";

export async function handlerFeeds(_cmdName: string) {
    const response = await getAllFeeds();

    const users = await getUsers();

    const userMap = new Map(users.map((user) => [user.id, user.name]));

    for (const feed of response) {
        console.log({
            name: feed.name,
            url: feed.url,
            feedCreator: userMap.get(feed.userId),
        });
    }
}
