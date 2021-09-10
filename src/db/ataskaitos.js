import { getDb } from "./db.js";

async function pagalIslaiduTipa(nuo, iki, sort) {
  const sortBy = {};
  if (sort) {
    if (sort.pavadinimas) {
      sortBy.pavadinimas = (sort.pavadinimas === "up") ? 1 : -1;
    } else if (sort.suma) {
      sortBy.suma = (sort.suma === "up") ? 1 : -1;
    }
  }
  const stages = [
    {
      $match: {
        $and: [
          { data: { $gte: nuo } },
          { data: { $lte: iki } },
        ],
      },
    },
    { $unwind: { path: "$prekes" } },
    {
      $group: {
        _id: "$prekes.islaiduTipas._id",
        pavadinimas: { $first: "$prekes.islaiduTipas.pavadinimas" },
        suma: { $sum: "$prekes.kaina" },
        kiekis: { $sum: 1 },
      },
    },
  ];
  if (Object.keys(sortBy).length > 0) {
    stages.push({ $sort: sortBy });
  }
  const db = await getDb();
  const rows = await db.collection("cekiai").aggregate(stages).toArray();
  return rows;
}

async function pagalMokejimuTipa(nuo, iki, sort) {
  const sortBy = {};
  if (sort) {
    if (sort.pavadinimas) {
      sortBy.pavadinimas = (sort.pavadinimas === "up") ? 1 : -1;
    } else if (sort.suma) {
      sortBy.suma = (sort.suma === "up") ? 1 : -1;
    }
  }
  const stages = [
    {
      $match: {
        $and: [
          { data: { $gte: nuo } },
          { data: { $lte: iki } },
        ],
      },
    },
    { $unwind: { path: "$prekes" } },
    {
      $group: {
        _id: "$mokejimuTipas._id",
        pavadinimas: { $first: "$mokejimuTipas.pavadinimas" },
        suma: { $sum: "$prekes.kaina" },
        kiekis: { $sum: 1 },
      },
    },
  ];
  if (Object.keys(sortBy).length > 0) {
    stages.push({ $sort: sortBy });
  }
  const db = await getDb();
  const rows = await db.collection("cekiai").aggregate(stages).toArray();
  return rows;
}

async function pagalPardaveja(nuo, iki, sort) {
  const sortBy = {};
  if (sort) {
    if (sort.pavadinimas) {
      sortBy.pavadinimas = (sort.pavadinimas === "up") ? 1 : -1;
    } else if (sort.suma) {
      sortBy.suma = (sort.suma === "up") ? 1 : -1;
    }
  }
  const stages = [
    {
      $match: {
        $and: [
          { data: { $gte: nuo } },
          { data: { $lte: iki } },
        ],
      },
    },
    { $unwind: { path: "$prekes" } },
    {
      $group: {
        _id: "$pardavejas._id",
        pavadinimas: { $first: "$pardavejas.pavadinimas" },
        suma: { $sum: "$prekes.kaina" },
        kiekis: { $sum: 1 },
      },
    },
  ];
  if (Object.keys(sortBy).length > 0) {
    stages.push({ $sort: sortBy });
  }
  const db = await getDb();
  const rows = await db.collection("cekiai").aggregate(stages).toArray();
  return rows;
}

async function pagalVisas(nuo, iki) {
  const stages = [
    {
      $match: {
        $and: [
          { data: { $gte: nuo } },
          { data: { $lte: iki } },
        ],
      },
    },
    { $unwind: { path: "$prekes" } },
    {
      $group: {
        _id: 1,
        suma: { $sum: "$prekes.kaina" },
        kiekis: { $sum: 1 },
      },
    },
  ];
  const db = await getDb();
  const rows = await db.collection("cekiai").aggregate(stages).toArray();
  if (rows.length > 0) {
    return rows[0];
  } else {
    return {
      suma: 0,
      kiekis: 0
    };
  }
}

export { pagalIslaiduTipa, pagalMokejimuTipa, pagalPardaveja, pagalVisas };
