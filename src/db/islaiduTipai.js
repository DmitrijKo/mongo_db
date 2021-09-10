import { ObjectId } from "mongodb";
import { getDb } from "./db.js";

async function getAll(userId) {
  const db = await getDb();
  const rows = await db.collection("islaiduTipai").find({}, {
    sort: {
      pavadinimas: 1,
    },
  }).toArray();
  return rows;
}

async function getOne(userId, _id) {
  const db = await getDb();
  if (!(_id instanceof ObjectId)) {
    _id = new ObjectId(_id);
  }
  const rows = await db.collection("islaiduTipai").find({ _id }).toArray();
  if (rows.length > 0) {
    return rows[0];
  }
  return null;
}

async function deleteOne(userId, _id) {
  const db = await getDb();
  if (!(_id instanceof ObjectId)) {
    _id = new ObjectId(_id);
  }
  const one = getOne(userId, _id);
  // TODO: ka daryti su egzistuojanciais tipais cekiuose ?
  if (one) {
    await db.collection("islaiduTipai").deleteOne({ _id });
    return one;
  }
  return null;
}

async function insertOne(userId, pavadinimas) {
  if (typeof pavadinimas !== "string" || pavadinimas.trim() === "") {
    return null;
  }
  const db = await getDb();
  const newRecord = {
    pavadinimas,
  };
  await db.collection("islaiduTipai").insertOne(newRecord);
  return newRecord;
}

async function updateOne(userId, _id, pavadinimas) {
  if (typeof pavadinimas !== "string" || pavadinimas.trim() === "") {
    return null;
  }
  const db = await getDb();
  if (!(_id instanceof ObjectId)) {
    _id = new ObjectId(_id);
  }
  await db.collection("islaiduTipai").updateOne({ _id }, {
    $set: { pavadinimas },
  });
  return getOne(userId, _id);
}

export { deleteOne, getAll, getOne, insertOne, updateOne };
