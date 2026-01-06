import { db } from "..";
import { Post, PostInsert, posts } from "../schema";

export async function createPost(post: PostInsert): Promise<Post> {
  const [result] = await db.insert(posts).values(post).returning();

  return result;
}
