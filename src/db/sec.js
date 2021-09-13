import { ObjectId } from "mongodb";
import { getDb } from "./db.js";
import { PermissionDenied } from "./PermissionDenied.js";

async function checkPermission(userId, permission) {
  if (userId === undefined || userId === null) {
    throw new PermissionDenied(`Persmission '${permission}' denied`);
  }
  if (!(userId instanceof ObjectId)) {
    userId = new ObjectId(userId);
  }
  try {
    const db = await getDb();
    const group = await db.collection("groups").findOne({
      users: userId,
      permissions: permission,
    }, {
      projection: {
        _id: 1,
      },
    });
    if (group) {
      return true;
    }
  } catch (err) {
    console.log("Failed to check permission", err);
  }
  throw new PermissionDenied(`Persmission '${permission}' denied`);
}

export { checkPermission };
