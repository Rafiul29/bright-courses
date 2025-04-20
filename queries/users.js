import { replaceMongoIdInObject } from "@/lib/convertData";
import { User } from "@/models/user-model";
import bcrypt from "bcryptjs";

export async function getUserByEmail(email) {
  const user = await User.findOne({ email: email }).select("-password").lean();

  return replaceMongoIdInObject(user);
}

export async function getUserById(id) {
  const user = await User.findById(id).lean();
  return replaceMongoIdInObject(user);
}

export async function validatePassword(email, password) {
  const user = await getUserByEmail(email);
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
}
