import { MongoClient } from "mongodb";

const URL = "mongodb+srv://dmitrij:dmitrij123@test1.gvjce.mongodb.net/cekiai?retryWrites=true&w=majority";
const DB_NAME = "cekiai";
const MAX_TRIES = 3;

let conn;

/**
 * <i><b>Prisijungia prie sukonfiguruotos duomenų bazės.</b></i>
 * 
 * @param {number} [tryCounter = 1] - bandymų skaičius prieš atsisakymą.
 * @throws {Error} kai nepavyko prisijungti.
 */
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


/**
 * <i><b>Testuoja nurodytą ryšį db.stats().</b></i>
 * 
 * @param {object} db - jungtis prie "db" duomenų bazės
 * @returns {boolean} "true" jeigu ryšys yra
 */
async function testConnection(db) {
  try {
    await db.stats();
    return true;
  } catch (err) {
    return false;
  }
}


/**
 * <i><b>Grąžina duomenų bazės pavadinimą.</b></i>
 * <i><b>Prisijungia automatiškai, jei nėra ryšio.</b></i>
 *
 * @returns {object} prijungtas ir išbandytas "db" objektas
 * @throws {Error} kai nepavyko prisijungti
 */
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


/**
 * <b><i>Uždaro ryšį su duomenų baze.</b></i>
 */
async function close() {
  try {
    await conn.close();
  } catch (err) {
    // ignored;
  }
  conn = null;
}

export { close, getDb };
