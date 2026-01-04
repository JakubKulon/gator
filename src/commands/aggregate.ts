import { parseDuration } from "src/lib/helpers/parseDuration";
import { scrapeFeed } from "src/lib/db/queries/rss";

export async function handlerAggregate(_cmdName: string, ...args: string[]) {
    console.log(`Collecting feeds every ${parseDuration(args[0])}ms`)

    scrapeFeed().catch(console.error);

    const interval = setInterval(() => {
        scrapeFeed().catch(console.error)
    }, parseDuration(args[0]))

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}
