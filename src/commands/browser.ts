import { User } from "src/lib/db/schema";
import { getPostsForUser } from "src/lib/db/queries/posts";

export async function handlerBrowser(_cmdName: string, user: User, ...args: string[]) {
    const limit = args[0] ? parseInt(args[0]) : 2;


    const result = await getPostsForUser(user.id, limit);



    console.log(result.map(item => {
        return {
            title: item.title,
            url: item.url,
            description: item.description,
            publishedAt: item.publishedAt,
        }
    }))

}