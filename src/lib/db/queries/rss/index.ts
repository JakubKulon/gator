import { XMLParser } from "fast-xml-parser";
import { getFeedByURL, getNextFeedToFetch, markFeedFetched } from "../feeds";

const xmlParser = new XMLParser();

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator",
        },
    });

    const responseText = await response.text();
    const data = xmlParser.parse(responseText);

    if (!data.rss.channel) {
        throw new Error("Invalid RSS feed");
    }

    if (!data.rss.channel.title || !data.rss.channel.link || !data.rss.channel.description) {
        throw new Error("Invalid RSS feed");
    }

    if (!data.rss.channel.item && !Array.isArray(data.rss.channel.item)) {
        data.rss.channel.item = [];
    }

    const validatedItems: RSSItem[] = [];

    for (const item of data.rss.channel.item) {
        if (item.title && item.link && item.description && item.pubDate) {
            validatedItems.push({
                title: item.title,
                link: item.link,
                description: item.description,
                pubDate: item.pubDate,
            });
        }
    }

    return {
        channel: {
            title: data.rss.channel.title,
            link: data.rss.channel.link,
            description: data.rss.channel.description,
            item: validatedItems,
        },
    };
}


export async function scrapeFeed(): Promise<void> {

    try {
        const nextFeedToFetch = await getNextFeedToFetch()
        await markFeedFetched(nextFeedToFetch.id)

        const feedData = await fetchFeed(nextFeedToFetch.url)

        for (const item of feedData.channel.item) {
            console.log(item.title)
        }

    } catch (error) {
        console.error(error)
    }
}