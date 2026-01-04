import { addFeed, createFeedFollow } from "src/lib/db/queries/feeds";
import { printFeed } from "src/lib/helpers/printFeed";
import { User } from "src/lib/db/schema";

export async function handlerAddFeed(_cmdName: string, user: User, ...args: string[]) {
    if (args.length < 2) {
        throw new Error("the addfeed handler expects two arguments: the feed name and the feed url");
    }

    const feedName = args[0];
    const feedUrl = args[1];

    const feedResponse = await addFeed({
        name: feedName,
        url: feedUrl,
        userId: user.id,
    });

    const feedFollowResponse = await createFeedFollow({
        feedId: feedResponse.id,
        userId: user.id,
    })

    console.log(feedFollowResponse.feedName, feedFollowResponse.userName);

    printFeed(feedResponse, user);
}
