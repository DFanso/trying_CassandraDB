require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cassandra = require("cassandra-driver");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(bodyParser.json());

const authProvider = new cassandra.auth.PlainTextAuthProvider(
  process.env.ASTRA_DB_CLIENT_ID,
  process.env.ASTRA_DB_CLIENT_SECRET
);

const client = new cassandra.Client({
  cloud: {
    secureConnectBundle: path.join(
      __dirname,
      process.env.ASTRA_DB_SECURE_CONNECT_BUNDLE_PATH
    ),
  },
  authProvider: authProvider,
  keyspace: process.env.ASTRA_DB_KEYSPACE,
});

client
  .connect()
  .then(() => {
    console.log("Connected to AstraDB");
  })
  .catch((err) => {
    console.error("Error connecting to AstraDB:", err);
  });

app.post("/api/users", async (req, res) => {
  const id = uuidv4(); // Generate a new UUID

  const query = "INSERT INTO users (id, name, email) VALUES (?, ?, ?)";
  const params = [id, req.body.name, req.body.email];

  try {
    await client.execute(query, params, { prepare: true });
    res.status(201).json({ message: "User created", id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  const query = "SELECT * FROM users WHERE id = ?";
  try {
    const result = await client.execute(query, [req.params.id], {
      prepare: true,
    });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/api/users/:id", async (req, res) => {
  const { name, email } = req.body;
  const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  try {
    await client.execute(query, [name, email, req.params.id], {
      prepare: true,
    });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const query = "DELETE FROM users WHERE id = ?";
  try {
    await client.execute(query, [req.params.id], { prepare: true });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
