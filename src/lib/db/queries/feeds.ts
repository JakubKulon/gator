import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { type Feed, type FeedFollow, type User } from "../schema";
import { eq } from "drizzle-orm";
import { getUser } from "./users";

type InsertFeed = Omit<Feed, "id">;
type InsertFeedFollow = Omit<FeedFollow, "id" | "createdAt" | "updatedAt">;


export async function addFeed(feed: InsertFeed): Promise<Feed> {
    const [result] = await db.insert(feeds).values(feed).returning();
    return result;
}

export async function getAllFeeds(): Promise<Feed[]> {
    const result = await db.select().from(feeds)
    return result;
}

export async function getFeedByURL(url: string): Promise<Feed | null> {
    const result = await db.select().from(feeds).where(eq(feeds.url, url));
    return result[0];
}

export async function createFeedFollow(feedFollow: InsertFeedFollow): Promise<FeedFollow & { feedName: Feed['name'], userName: User['name'] }> {
    const [result] = await db.insert(feedFollows).values(feedFollow).returning();

    const [joinedResult] = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        feedName: feeds.name,
        userName: users.name,
    }).from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(feedFollows.id, result.id))


    return joinedResult;
}

export async function getFeedFollowsForUser(userId: string): Promise<{ feedName: Feed['name'], userName: User['name'] }[]> {
    const result = await db.select({
        feedName: feeds.name,
        userName: users.name,
    }).from(feedFollows).innerJoin(feeds, eq(feedFollows.feedId, feeds.id)).innerJoin(users, eq(feedFollows.userId, users.id)).where(eq(feedFollows.userId, userId));

    return result;
}
