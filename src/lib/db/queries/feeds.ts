import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { type Feed, type FeedFollow, type User } from "../schema";
import { and, eq, asc, desc, sql } from "drizzle-orm";

type InsertFeed = Omit<Feed, "id" | "updatedAt" | "lastFetchedAt">;
type InsertFeedFollow = Omit<FeedFollow, "id" | "createdAt" | "updatedAt">;


export async function addFeed(feed: InsertFeed): Promise<Feed> {
    const [result] = await db.insert(feeds).values(feed).returning();
    if (!result) {
        throw new Error("Failed to add feed");
    }
    return result;
}

export async function getAllFeeds(): Promise<Feed[]> {
    const result = await db.select().from(feeds)
    if (!result) {
        throw new Error("Failed to get all feeds");
    }
    return result;
}

export async function getFeedByURL(url: string): Promise<Feed> {
    const result = await db.select().from(feeds).where(eq(feeds.url, url));
    if (!result) {
        throw new Error("Failed to get feed by URL");
    }
    return result[0];
}

export async function createFeedFollow(feedFollow: InsertFeedFollow): Promise<FeedFollow & { feedName: Feed['name'], userName: User['name'] }> {
    const [result] = await db.insert(feedFollows).values(feedFollow).returning();
    if (!result) {
        throw new Error("Failed to create feed follow");
    }
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
    if (!joinedResult) {
        throw new Error("Failed to create feed follow");
    }
    return joinedResult;
}

export async function getFeedFollowsForUser(userId: string): Promise<{ feedName: Feed['name'], userName: User['name'] }[]> {
    const result = await db.select({
        feedName: feeds.name,
        userName: users.name,
    }).from(feedFollows).innerJoin(feeds, eq(feedFollows.feedId, feeds.id)).innerJoin(users, eq(feedFollows.userId, users.id)).where(eq(feedFollows.userId, userId));
    if (!result) {
        throw new Error("Failed to get feed follows for user");
    }
    return result;
}

export async function deleteFeedFollow(feedFollowId: string, userId: string): Promise<FeedFollow> {
    const [result] = await db.delete(feedFollows).where(and(eq(feedFollows.feedId, feedFollowId), eq(feedFollows.userId, userId))).returning();
    if (!result) {
        throw new Error("Failed to delete feed follow");
    }
    return result;
}

export async function markFeedFetched(feedId: string): Promise<Feed> {
    const [result] = await db.update(feeds).set({ lastFetchedAt: new Date() }).where(eq(feeds.id, feedId)).returning();
    if (!result) {
        throw new Error("Failed to mark feed fetched");
    }
    return result;
}

export async function getNextFeedToFetch(): Promise<Feed> {
    const [result] = await db.select().from(feeds).orderBy(sql`${feeds.lastFetchedAt} asc nulls first`).limit(1);
    if (!result) {
        throw new Error("Failed to get next feed to fetch");
    }
    return result;
}
