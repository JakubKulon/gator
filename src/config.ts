import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

function getConfigFilePath(): string {
  return path.join(os.homedir(), "/.gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  fs.writeFileSync(
    getConfigFilePath(),
    JSON.stringify({
      db_url: cfg.dbUrl,
      current_user_name: cfg.currentUserName,
    })
  );
}

function validateConfig(rawConfig: any): Config {
  const parsedConfig = JSON.parse(rawConfig);

  if (typeof parsedConfig !== "object") {
    throw new Error("not valid");
  }

  if (!("db_url" in parsedConfig)) {
    throw new Error("not valid");
  }

  if ("db_url" in parsedConfig && typeof parsedConfig["db_url"] !== "string") {
    throw new Error("not valid");
  }

  if (
    "current_user_name" in parsedConfig &&
    typeof parsedConfig["current_user_name"] !== "string"
  ) {
    throw new Error("not valid");
  }

  return {
    currentUserName: parsedConfig["current_user_name"],
    dbUrl: parsedConfig["db_url"],
  };
}

export function setUser(user: string) {
  const data = readConfig();

  writeConfig({
    currentUserName: user,
    dbUrl: data.dbUrl,
  });
}

export function readConfig(): Config {
  const gatorConfigFile = fs.readFileSync(getConfigFilePath(), {
    encoding: "utf-8",
  });

  return validateConfig(gatorConfigFile);
}
