import { Feed } from "../db/schema";
import { User } from "../db/schema";

export function printFeed(feed: Feed, user: User) {
    console.log(`Feed: ${JSON.stringify(feed)}`);
    console.log(`User: ${JSON.stringify(user)}`);
}