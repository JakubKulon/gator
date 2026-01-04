import { getFeedByURL, createFeedFollow } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export async function handlerFollowFeed(_cmdName: string, user: User, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("the follow handler expects a single argument, the feed url");
    }

    const feedUrl = args[0];

    const feedResponse = await getFeedByURL(feedUrl);

    if (!feedResponse) {
        throw new Error(`Feed ${feedUrl} not found in the database.`);
    }

    const feedFollowResponse = await createFeedFollow({
        feedId: feedResponse.id,
        userId: user.id,
    })

    console.log({
        feedName: feedFollowResponse.feedName,
        feedCreator: feedFollowResponse.userName,
    });
}
