import { getFeedFollowsForUser } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export async function handlerFollowing(_cmdName: string, user: User) {
    const response = await getFeedFollowsForUser(user.id);

    console.log(JSON.stringify(response));
}
