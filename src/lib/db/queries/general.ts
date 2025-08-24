import { db } from "..";
import { users } from "../schema";

export async function resetUsers() {
  const response = await db.delete(users).returning();

  return response;
}
