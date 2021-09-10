import { ObjectId } from "mongodb";

import { getDb } from "./db.js";
import { getOne as getIslaiduTipas } from "./islaiduTipai.js";
import { getOne as getMokejimuTipas } from "./mokejimuTipai.js";
import { getOne as getPardavejas } from "./pardavejai.js";

const URL = "mongodb://app.simpledbr.com:27017";

async function getAll(userId) {
  const db = await getDb();
  return await db.collection("cekiai").find().toArray();
}

async function getOne(userId, _id) {
  const db = await getDb();
  if (!(_id instanceof ObjectId)) {
    _id = new ObjectId(_id);
  }
  const rows = await db.collection("cekiai").find({ _id }).toArray();
  if (rows.length > 0) {
    return rows[0];
  }
  return null;
}

async function insertOne(userId, cekis) {
  const db = await getDb();
  cekis.pardavejas = await getPardavejas(userId, cekis.pardavejaiId);
  if (!cekis.pardavejas) {
    throw new Error("Nezinomas pardavejas");
  }
  delete cekis.pardavejaiId;
  cekis.mokejimuTipas = await getMokejimuTipas(userId, cekis.mokejimuTipaiId);
  if (!cekis.mokejimuTipas) {
    throw new Error("Nezinomas mokejimu tipas");
  }
  cekis.data = new Date(cekis.data);
  if (!isFinite(cekis.data.getTime())) {
    throw new Error("Bloga cekio data");
  }
  delete cekis.mokejimuTipaiId;
  for (const preke of cekis.prekes) {
    preke.islaiduTipas = await getIslaiduTipas(userId, preke.islaiduTipaiId);
    if (!preke.islaiduTipas) {
      throw new Error("Nezinomas islaidu tipas");
    }
    delete preke.islaiduTipaiId;
    delete preke.id;
    preke._id = new ObjectId();
  }
  await db.collection("cekiai").insertOne(cekis);
  return cekis;
}

async function updateOne(userId, cekis) {
  const db = await getDb();
  cekis._id = new ObjectId(cekis._id);
  const orig = await getOne(userId, cekis._id);
  cekis.pardavejas = await getPardavejas(userId, cekis.pardavejaiId);
  if (!cekis.pardavejas) {
    throw new Error("Nezinomas pardavejas");
  }
  delete cekis.pardavejaiId;
  cekis.mokejimuTipas = await getMokejimuTipas(userId, cekis.mokejimuTipaiId);
  if (!cekis.mokejimuTipas) {
    throw new Error("Nezinomas mokejimu tipas");
  }
  delete cekis.mokejimuTipaiId;
  orig.prekes = orig.prekes.filter((op) =>
    cekis.prekes.find((p) => p.id === op._id.toHexString())
  );
  cekis.data = new Date(cekis.data);
  if (!isFinite(cekis.data.getTime())) {
    throw new Error("Bloga cekio data");
  }
  for (const preke of cekis.prekes) {
    if (preke.id < 0) {
      orig.prekes.push({
        _id: new ObjectId(),
        pavadinimas: preke.pavadinimas,
        kaina: preke.kaina,
        islaiduTipas: await getIslaiduTipas(userId, preke.islaiduTipaiId),
      });
    } else {
      const prekeUpdate = orig.prekes.find(p => p._id.toHexString() === preke.id);
      prekeUpdate.pavadinimas = preke.pavadinimas;
      prekeUpdate.kaina = preke.kaina;
      prekeUpdate.islaiduTipas = await getIslaiduTipas(userId, preke.islaiduTipaiId);
    }
  }
  cekis.prekes = orig.prekes;
  await db.collection("cekiai").updateOne({
    _id: cekis._id,
  }, {$set: cekis});
  return cekis;
}

async function deleteOne(userId, _id) {
  const db = await getDb();
  await db.collection("cekiai").deleteOne({
    _id: ObjectId(_id),
  });
}

export { deleteOne, getAll, getOne, insertOne, updateOne };
