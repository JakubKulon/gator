import { fetchFeed } from "src/lib/db/rss";
import { readConfig, setUser } from "../config";
import { resetUsers } from "../lib/db/queries/general";
import { getUser, createUser, getUsers } from "../lib/db/queries/users";
import { addFeed, createFeedFollow, getAllFeeds, getFeedByURL, getFeedFollowsForUser } from "src/lib/db/queries/feeds";
import { printFeed } from "src/lib/helpers/printFeed";

export async function handlerLogin(_cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error(
      "the login handler expects a single argument, the username"
    );
  }

  const response = await getUser(args[0]);
  if (!response) {
    throw new Error("user doesn't exist");
  }
  setUser(args[0]);

  console.log(`user ${args[0]} has been set`);
}

export async function handlerRegister(_cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error(
      "the register handler expects a single argument, the username name"
    );
  }

  const isUserExist = await getUser(args[0]);

  if (isUserExist) {
    throw new Error("user already exist, please provide diffrent name");
  }
  const response = await createUser(args[0]);
  setUser(response.name);

  console.log(`User ${response.name} has been created`);
}

export async function handleReset(_cmdName: string, ...args: string[]) {
  await resetUsers();


  console.log("All users has been reseted");
}

export async function handleUsers() {
  const response = await getUsers();

  const currentUser = readConfig().currentUserName;

  const users = response.map((user) => {
    if (user.name === currentUser) {
      return `* ${user.name} (current)`;
    }
    return `* ${user.name}`;
  });
  console.log(users);
}

export async function handlerAgg(_cmdName: string) {

  const response = await fetchFeed('https://www.wagslane.dev/index.xml');
  console.log(JSON.stringify(response));
}

export async function handlerAddFeed(_cmdName: string, ...args: string[]) {
  if (args.length < 2) {
    throw new Error("the addfeed handler expects two arguments: the feed name and the feed url");
  }

  const feedName = args[0];
  const feedUrl = args[1];

  const currentUser = readConfig().currentUserName;

  const user = await getUser(currentUser);
  if (!user) {
    throw new Error(`User ${currentUser} not found in the database.`);
  }

  const feedResponse = await addFeed({
    name: feedName,
    url: feedUrl,
    userId: user.id,
  });

  const feedFollowResponse = await createFeedFollow({
    feedId: feedResponse.id,
    userId: user.id,
  })

  console.log(feedFollowResponse.feedName, feedFollowResponse.userName);


  printFeed(feedResponse, user);
}

export async function handlerFeeds(_cmdName: string) {
  const response = await getAllFeeds();

  const users = await getUsers();

  const userMap = new Map(users.map((user) => [user.id, user.name]));

  for (const feed of response) {
    console.log({
      name: feed.name,
      url: feed.url,
      feedCreator: userMap.get(feed.userId),
    });
  }
}

export async function handlerFollowFeed(_cmdName: string, ...args: string[]) {
  if (args.length < 1) {
    throw new Error("the follow handler expects a single argument, the feed url");
  }

  const feedUrl = args[0];

  const currentUser = readConfig().currentUserName;

  const user = await getUser(currentUser);
  if (!user) {
    throw new Error(`User ${currentUser} not found in the database.`);
  }

  const feedResponse = await getFeedByURL(feedUrl);

  if (!feedResponse) {
    throw new Error(`Feed ${feedUrl} not found in the database.`);
  }

  const feedFollowResponse = await createFeedFollow({
    feedId: feedResponse.id,
    userId: user.id,
  })

  console.log({
    feedName: feedFollowResponse.feedName,
    feedCreator: feedFollowResponse.userName,
  });

}

export async function handlerFollowing(_cmdName: string) {
  const currentUserName = readConfig().currentUserName;
  const user = await getUser(currentUserName);

  if (!user) {
    throw new Error(`User ${currentUserName} not found`);
  }

  const response = await getFeedFollowsForUser(user.id);

  console.log(JSON.stringify(response));
}