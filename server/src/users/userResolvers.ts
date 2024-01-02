// userResolvers.ts
import { PubSub } from "graphql-subscriptions";
import { UserInterface } from "../interfaces/userInterface";
import {
  registerService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
  deleteUserByIdService,
  getAllUsersService,
  comperepasswordService,
  getTimeRegisterService,
} from "./userService";
import { resolversinterface } from "../interfaces/resolverinterface";
import * as JWT from "../jwt/jwt";
import { generateUniqueCode } from "../nodemailer/nodemailer";
import { generateUserPassword } from "../bycrypt/bycrypt";
import { sendemail } from "../nodemailer/nodemailer";
const pubsub = new PubSub();
let flag = true;
export const userResolvers = {
  registerUser: async (
    parent: string,
    args: { email: string; password: string },
    context: string,
    info: string
  ): Promise<{ user: UserInterface; accessToken: string }> => {
    console.log(
      "Received mutation with email:",
      args.email,
      "and password:",
      args.password
    );
    try {
      const registerUser: UserInterface = args;
      console.log(registerUser.password, "register");

      registerUser.password = generateUserPassword(
        registerUser.password as string
      );
      const user = await registerService(registerUser);
      if (user) {
        pubsub.publish("TIME_REGISTER_CHANNEL", {
          getTimeRegister: getTimeRegisterService,
        });
        const accessToken = JWT.generateAccessToken(user);
        return { user, accessToken };
      } else {
        throw new Error("No Users found");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Server error while registering user");
    }
  },

  forgotPassword: async (
    parent: string,
    args: { email: string },
    context: string,
    info: string
  ): Promise<string> => {
    const emailToReset = args.email;
    console.log(emailToReset, "emailtoreset");
    const code = generateUniqueCode();
    try {
      sendemail(emailToReset, code);
      const result = forgotPasswordService(emailToReset, code);
      return "Email sent with instructions to reset your password.";
    } catch (error) {
      console.error("Error sending email", error);
      throw new Error("Internal Server Error");
    }
  },

  comperepassword: async (
    parent: string,
    args: { email: string; code: string },
    context: string,
    info: string
  ): Promise<string> => {
    const emailToReset = args.email;
    const code = args.code;
    try {
      const result = comperepasswordService(emailToReset, code);
      return "Success";
    } catch (error) {
      console.error("Error ", error);
      throw new Error("Internal Server Error");
    }
  },

  resetPassword: async (
    parent: string,
    args: { email: string; password: string },
    context: string,
    info: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { email, password } = args;
      const result = await resetPasswordService(email, password);
      return { success: true, message: "Password reset successful" };
    } catch (error) {
      console.error("Error resetting password:", error);
      throw new Error("Internal Server Error");
    }
  },

  login: async (
    parent: string,
    args: { email: string; password: string },
    context: string,
    info: string
  ): Promise<{ user: UserInterface; accessToken: string }> => {
    try {
      const logInUser: UserInterface = args;
      const user = await loginService(logInUser);

      if (user) {
        const accessToken = JWT.generateAccessToken(user);
        return { user, accessToken };
      }
      throw new Error("Incorrect email or password");
    } catch (error) {
      console.error(error);
      throw new Error("Server error while logging in");
    }
  },

  deleteUser: async (
    parent: string,
    args: { id: number },
    context: string,
    info: string
  ): Promise<string> => {
    try {
      console.log(args.id, "dele");
      const userId = args.id;
      const deleteUserId = await deleteUserByIdService(Number(userId));
      return `${deleteUserId} user deleted successfully`;
    } catch (error) {
      console.error(error);
      throw new Error("Server error while deleting user");
    }
  },

  getAllUsers: async (): Promise<UserInterface[]> => {
    try {
      const allUsers = await getAllUsersService();
      if (allUsers === undefined) {
        throw new Error("Failed to retrieve user data");
      }
      return allUsers;
    } catch (error) {
      console.error(error);
      throw new Error("Server error while getting all users");
    }
  },
  getRegisterTime:async (): Promise<number[]> => {
      try {
        const allUsers = await getTimeRegisterService();
        if (allUsers === undefined) {
          throw new Error("Failed to retrieve user data");
        }
        return allUsers
      } catch (error) {
        console.error(error);
        throw new Error("Server error while getting all users");
      }
  },
  getTimeRegister: {
    subscribe: async () => {
      try {
        const allUsers = await getTimeRegisterService();
        if (allUsers === undefined) {
          throw new Error("Failed to retrieve user data");
        }
        return pubsub.asyncIterator(["TIME_REGISTER_CHANNEL"]);
      } catch (error) {
        console.error(error);
        throw new Error("Server error while getting all users");
      }
    },
  },
};
