import { ObjectId } from "mongodb";
import { getDb } from "./db.js";
import { checkPermission } from "./sec.js";
import permissions from "../permissions.js";


/**
 * <br><i>Operacijos su mokėjimu tipais.</br></i>
 * @namespace mokejimuTipai
 */

/**
 * <i><br>Grąžina sąrašą visų mokėjimų tipų.</br></i>
 *
 * @param {string} userId - šią operaciją atliekančio vartotojo ID
 * @returns {Array<{_id: MongoId, name: string}>} mokėjimų tipų sąrašas
 * @throws {PermissionDenied} jei vartotojui neleidžiama atlikti šios operacijos
 * @memberof mokejimuTipai
 */
async function getAll(userId) {
  await checkPermission(userId, permissions.mokejimuTipaiRead);
  const db = await getDb();
  const rows = await db.collection("mokejimuTipai").find({}, {
    sort: {
      pavadinimas: 1,
    },
  }).toArray();
  return rows;
}


/**
 * <br><i>Grąžina mokėjimų tipus pagal id.</br></i>
 *
 * @param {string} userId - šią operaciją atliekančio vartotojo ID
 * @param {string} _id - surasto mokėjimo tipo ID
 * @param {boolean} [nocheck = false] - netikrina prisijungimo leidimo, jei "true"
 * @returns {{_id: MongoId, name: string}|null} mokejimu tipas | null, jeigu nerastas
 * @throws {PermissionDenied} jei vartotojui neleidžiama atlikti šios operacijos
 * @memberof mokejimuTipai
 */
async function getOne(userId, _id, nocheck) {
  if (nocheck) {
    await checkPermission(userId, permissions.pardavejaiRead);
  }
  const db = await getDb();
  if (!(_id instanceof ObjectId)) {
    _id = new ObjectId(_id);
  }
  const rows = await db.collection("mokejimuTipai").find({ _id }).toArray();
  if (rows.length > 0) {
    return rows[0];
  }
  return null;
}

async function deleteOne(userId, _id) {
  await checkPermission(userId, permissions.mokejimuTipaiDelete);
  const db = await getDb();
  if (!(_id instanceof ObjectId)) {
    _id = new ObjectId(_id);
  }
  const one = getOne(userId, _id);
  if (one) {
    await db.collection("mokejimuTipai").deleteOne({ _id });
    return one;
  }
  return null;
}

async function insertOne(userId, pavadinimas) {
  await checkPermission(userId, permissions.mokejimuTipaiInsert);
  if (typeof pavadinimas !== "string" || pavadinimas.trim() === "") {
    return null;
  }
  const db = await getDb();
  const newRecord = {
    pavadinimas,
  };
  await db.collection("mokejimuTipai").insertOne(newRecord);
  return newRecord;
}

async function updateOne(userId, _id, pavadinimas) {
  await checkPermission(userId, permissions.mokejimuTipaiUpdate);
  if (typeof pavadinimas !== "string" || pavadinimas.trim() === "") {
    return null;
  }
  const db = await getDb();
  if (!(_id instanceof ObjectId)) {
    _id = new ObjectId(_id);
  }
  await db.collection("mokejimuTipai").updateOne({ _id }, {
    $set: { pavadinimas },
  });
  return getOne(userId, _id);
}

export { deleteOne, getAll, getOne, insertOne, updateOne };
