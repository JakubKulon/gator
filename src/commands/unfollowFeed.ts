import { getFeedByURL, deleteFeedFollow } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export async function handlerUnfollowFeed(_cmdName: string, user: User, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("the unfollow handler expects a single argument, the feed url");
    }

    const feedUrl = args[0];

    const feedResponse = await getFeedByURL(feedUrl);

    if (!feedResponse) {
        throw new Error(`Feed ${feedUrl} not found in the database.`);
    }

    await deleteFeedFollow(feedResponse.id, user.id);
}
