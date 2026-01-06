import { db } from "..";
import { eq, desc } from "drizzle-orm";
import { feedFollows, feeds, Post, PostInsert, posts } from "../schema";

export async function createPost(post: PostInsert): Promise<Post> {
  const [result] = await db.insert(posts).values(post).returning();

  return result;
}

export async function getPostsForUser(userId: string, limit: number): Promise<Post[]> {
  const result = await db
    .select()
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

  return result.map((row) => row.posts);
}
