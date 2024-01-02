import { Response } from "express";
import chalk from "chalk";

export const handleError = (
  res: Response,
  error: unknown ,
  status: number = 400
) => {
  if (error && error instanceof Error)
    return res.status(status).send(error.message);
  return res.status(status).send("Oops... an error accorded");
};

export const handleDBResponseError = <T>(error: T) => {
  if (error instanceof Error) return Promise.reject(error);
  console.log(chalk.redBright(error));
  return Promise.reject(new Error("Something went wong!"));
};