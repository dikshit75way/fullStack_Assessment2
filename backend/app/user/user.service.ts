import User from "./user.schema";
import { type IUser } from "./user.dto";

export const createUser = async (data: Partial<IUser>) => {
  return await User.create(data);
};

export const getUserByEmail = async (email: string, select?: Record<string, boolean>) => {
  const query = User.findOne({ email });
  if (select) {
    query.select(select);
  }
  return await query.lean();
};

export const getUserById = async (id: string) => {
  return await User.findById(id).lean();
};

export const updateUser = async (
  id: string,
  data: Partial<IUser>
): Promise<IUser> => {
  const result = await User.findByIdAndUpdate(id, data, { new: true });
  return result as IUser;
};

export const getAllUsers = async (): Promise<IUser[]> => {
    return await User.find({}).lean();
};
