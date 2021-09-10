import { MongoClient } from "mongodb";

 const URL = "mongodb://localhost:27017";
const DB_NAME = "cekiai";
const MAX_TRIES = 3;

let conn;

async function connect(tryCounter) {
  if (!tryCounter) {
    tryCounter = 1;
  }
  if (tryCounter > MAX_TRIES) {
    throw new Error(`Failed to connect ${MAX_TRIES} times to db`);
  }
  conn = new MongoClient(URL, {
    minPoolSize: 0,
    maxPoolSize: 3,
  });
  try {
    await conn.connect();
  } catch (err) {
    conn = null;
    connect(++tryCounter);
  }
}

async function testConnection(db) {
  try {
    await db.stats();
    return true;
  } catch (err) {
    return false;
  }
}

async function getDb() {
  if (!conn) {
    await connect();
  }
  const db = conn.db(DB_NAME);
  if (testConnection(db)) {
    return db;
  }
  conn = null;
  return getDb();
}

async function close() {
  try {
    await conn.close();
  } catch (err) {
    // ignored;
  }
  conn = null;
}

export { close, getDb };
