# Node.js CRUD Application with AstraDB and Cassandra

This is a simple CRUD application built with Node.js, Express, and AstraDB (Cassandra-as-a-Service) by DataStax. The application demonstrates how to perform basic Create, Read, Update, and Delete operations on a Cassandra database using the DataStax Node.js Driver.

## Prerequisites

- Node.js (version 14 or higher recommended)
- npm
- An AstraDB account (you can sign up for a free tier)

## Setup

1. Clone the repository:
```
git clone https://github.com/DFanso/trying_CassandraDB
```

```
cd your-repository
```

2. Install dependencies:
```
npm i
```

3. Download the secure connect bundle from the AstraDB dashboard and place it in the `secure-connect` folder.

4. Create a `.env` file in the root of the project directory and set the following environment variables:

```
ASTRA_DB_CLIENT_ID=<your_astra_db_client_id>
ASTRA_DB_CLIENT_SECRET=<your_astra_db_client_secret>
ASTRA_DB_TOKEN=<your_astra_db_token>
ASTRA_DB_KEYSPACE=<your_astra_db_keyspace>
ASTRA_DB_SECURE_CONNECT_BUNDLE_PATH=./secure-connect/your_downloaded_secure_connect_bundle.zip
```


5. Create the `users` table in your AstraDB keyspace using the AstraDB CQL console or the `cqlsh` command-line tool:

```
CREATE TABLE IF NOT EXISTS dfanso.users (
  id UUID PRIMARY KEY,
  name text,
  email text
);
```
## Running the Application


1. Start the application:
```
npm start
```
2. The application will be running on `http://localhost:3000`.

## API Endpoints

- Create a new user (POST): `/api/users`
 ```
{
  "name": "Leo Gavin",
  "email": "dfanso@pm.me"
}
```
- Retrieve a user by ID (GET): `/api/users/:id`
- Update a user's information (PUT): `/api/users/:id`
```
{
  "name": "DFanso",
  "email": "dfanso@pm.me"
}
```
- Delete a user by ID (DELETE): `/api/users/:id`
