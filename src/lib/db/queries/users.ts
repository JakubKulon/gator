import { eq } from "drizzle-orm/sql";
import { db } from "..";
import { users } from "../schema";



export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(name: string) {
  const result = await db.query.users.findFirst({
    where: eq(users.name, name),
  });

  return result;
}


export async function getUsers() {
  const result = await db.query.users.findMany();
  return result;
}
