
# Gator

Gator is a CLI-based RSS aggregator built with TypeScript, Node.js, and Postgres (via Drizzle ORM).

## Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- npm

## Setup

1.  **Install dependencies**

    ```bash
    npm install
    ```

2.  **Start PostgreSQL via Docker**

    Ensure you have Docker installed and running, then start the database container:

    ```bash
    docker compose up -d
    ```

    *Note: You might need to use `sudo` if your user is not in the `docker` group.*

3.  **Configuration**

    Create a configuration file at `~/.gatorconfig.json` (in your home directory) with the following structure. Use the database URL that matches the Docker setup:

    ```json
    {
      "db_url": "postgres://gator:password@localhost:5432/gator",
      "current_user_name": ""
    }
    ```

    *   `db_url`: The PostgreSQL connection string for the Docker container.
    *   `current_user_name`: Initial user name (can be empty).

4.  **Database Migration**

    Ensure your database schema is up to date (run this after starting the database):

    ```bash
    npx drizzle-kit push
    ```

## Usage

Run the tool using `npm start` followed by the command and arguments.

### Available Commands

#### Register a new user

Registers a new user in the database and logs them in (updates `current_user_name` in config).

```bash
npm start register <username>
```

#### Login

Logs in as an existing user.

```bash
npm start login <username>
```

#### List Users

Lists all users in the database. The currently logged-in user is marked with `(current)`.

```bash
npm start users
```

#### Reset Users

Resets (deletes) all users from the database.

```bash
npm start reset
```

#### Add a Feed

Follows a new RSS feed.

```bash
npm start follow <url>
```

#### List Followed Feeds

Lists all feeds followed by the current user.

```bash
npm start following
```

#### Unfollow a Feed

Unfollows an existing RSS feed.

```bash
npm start unfollow <url>
```

#### Browse Posts

Displays the latest posts from your followed feeds. Optionally specify a limit (default is 2).

```bash
npm start browser [limit]
```

#### Run Aggregator

Starts the RSS aggregator to fetch new posts from followed feeds at a specified interval (e.g., `5s` for 5 seconds).

```bash
npm start agg <interval>
```

## Tech Stack

-   **Language**: TypeScript
-   **Runtime**: Node.js
-   **Database**: PostgreSQL
-   **ORM**: Drizzle ORM
-   **CLI**: Custom implementation via `process.argv`

## Troubleshooting

### Docker Permissions

If you encounter a "permission denied" error when running Docker commands, it's likely because your user doesn't have permissions to access the Docker daemon socket.

**Option 1: Run with sudo**
Run the Docker commands directly with `sudo`:
```bash
sudo docker compose up -d
```

**Option 2: Add your user to the docker group (Recommended)**
1. Create the docker group:
   ```bash
   sudo groupadd docker
   ```
2. Add your user to the docker group:
   ```bash
   sudo usermod -aG docker $USER
   ```
3. Log out and log back in so that your group membership is re-evaluated (or run `newgrp docker`).
