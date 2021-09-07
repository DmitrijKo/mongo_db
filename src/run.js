import { MongoClient, ObjectId } from "mongodb";

const conn = new MongoClient("mongodb://localhost:27017");

await conn.connect();

const db = conn.db("cekiai");

 await db.collection("cekiai").insertOne({
   data: new Date(),
   pardavejas: "Maxima",
   mokejimuTipas: "kortele",
   prekes: [
       {
           _id: ObjectId(),
           pavadinimas: "Duona",
           kaina: 2.3,
           islaiduTipas: "maistas"
       },
       {
           _id: ObjectId(),
           pavadinimas: "Limonadas",
           kaina: 1.4,
           islaiduTipas: "gerimai"
       },
       {
           _id: ObjectId(),
           pavadinimas: "Sviestas",
           kaina: 2,
           islaiduTipas: "maistas"
       }
   ]
 });

 const cekiai = await db.collection("cekiai").find().toArray();

console.log(cekiai);

conn.close();
