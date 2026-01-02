import { db } from "..";
import { feeds } from "../schema";
import { type Feed } from "../schema";
import { eq } from "drizzle-orm";

type InsertFeed = Omit<Feed, "id">;


export async function addFeed(feed: InsertFeed): Promise<Feed> {
    const [result] = await db.insert(feeds).values(feed).returning();
    return result;
}