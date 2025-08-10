import { readConfig, setUser } from "./config";

function main() {
  console.log("Hello, world!");
}

setUser("Lane");
console.log(readConfig());

main();
