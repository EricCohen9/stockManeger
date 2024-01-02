import { UserInterface } from "../interfaces/userInterface";
import {
  loginDal,
  registerDal,
  deleteUserByIdDal,
  forgotPasswordDal,
  resetPasswordDal,
  getAllUsersDal,
  comperepasswordDal,
  getTimeRegisterDal,
} from "../users/userDal";
import { generateUserPassword } from "../bycrypt/bycrypt";
import { resolversinterface } from "../interfaces/resolverinterface";
import RedisClient from "../redis/redis";
export const registerService = async (user: UserInterface) => {
  try {
    // const key = `usersRegister:${user.email}`;

    // const dataFromRedis = await RedisClient.get(key);
    // if (dataFromRedis) {
    //   console.log("Data retrieved from Redis");
    //   return JSON.parse(dataFromRedis);
    
    const result = await registerDal(user);
    // await RedisClient.setEx(key, 200, JSON.stringify(result));
    // console.log("Data stored in Redis");
    return result;
  } catch (err) {
    console.error("Error reading data:(service)", err);
    throw err;
  }
};
export const forgotPasswordService = async (email: string, code: string) => {
  try {
    const result = await forgotPasswordDal(email, code);
    return result;
  } catch (err) {
    console.error("Error reading data:(service)", err);
    throw err;
  }
};
export const comperepasswordService = async (email: string, code: string) => {
  try {
    const result = await comperepasswordDal(email, code);
    return result;
  } catch (err) {
    console.error("Error reading data:(service)", err);
    throw err;
  }
};
export const resetPasswordService = async (
  email: string,
  newPassword: string
) => {
  try {
    const newPasswordBycrypt = generateUserPassword(newPassword);
    const result = await resetPasswordDal(email, newPasswordBycrypt);
    return result;
  } catch (err) {
    console.error("Error reading data:(service)", err);
    throw err;
  }
};

export const loginService = async (user: UserInterface) => {
  try {
    const key = `loginService:${user.email}`;
    const dataFromRedis = await RedisClient.get(key);
    if (dataFromRedis) {
      console.log("Data retrieved from Redis");
      return JSON.parse(dataFromRedis);
    }
    const result = await loginDal(
      user.email as string,
      user.password as string
    );
    await RedisClient.setEx(key, 200, JSON.stringify(result));
    console.log("Data stored in Redis");
    return result;
  } catch (err) {
    console.error("Error reading data:(service)", err);
    throw err;
  }
};

export const deleteUserByIdService = async (userId: number) => {
  try {
    const deleteUser = await deleteUserByIdDal(userId);
    return deleteUser;
  } catch (arr) {
    console.error("Error delete user:(service)", arr);
    throw arr;
  }
};
export const getAllUsersService = async () => {
  try {
    const key = `getAllUser:getAllUsersService`;

    const dataFromRedis = await RedisClient.get(key);
    if (dataFromRedis) {
      console.log("Data retrieved from Redis");
      return JSON.parse(dataFromRedis);
    }
    const users = await getAllUsersDal();
    await RedisClient.setEx(key, 200, JSON.stringify(users));
    console.log("Data stored in Redis");

    return users;
    
  } catch (arr) {
    console.error("Error get all users:(service)", arr);
    throw arr;
  }
};

export const getTimeRegisterService = async (): Promise<number[]|undefined> => {
  try {
    const registrations = await getTimeRegisterDal();
    return registrations;
  } catch (error) {
    console.error("Error in getTimeRegisterController:", error);
    throw error;
  }
};
