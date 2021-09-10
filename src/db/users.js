import { getDb } from "./db.js";

async function login(name, pass) {
  const db = await getDb();
  const users = await db.collection("users").find({ name, pass }).toArray();
  if (users.length > 0) {
    return users[0]._id;
  }
  return null;
}

export { login };
