import Jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import * as dotenv from 'dotenv';
import { getUserById } from "../users/userDal";
import { UserInterface } from "../interfaces/userInterface"
dotenv.config();

 const isAdmin = (user:UserInterface) => {
  return user.isadmin? true: false
}

const urlNeedAdmin = (url:string) => {
  const needAdmin:string[] = ['/api/users/']
  return needAdmin.includes(url)
}

export const generateAccessToken=(user:UserInterface)=> {
    const secretKey=process.env.SECRET_TOKEN_KEY as string
    return Jwt.sign( String(user.id), secretKey)
  }

export const verifyToken =  (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers['authorization']
    if (token == null) {
        return res.json(  "no token found"  ).sendStatus(401)
    }
    const secretKey:string = process.env.SECRET_TOKEN_KEY as string
    Jwt.verify(token,secretKey ,async (err, userId: unknown|string ) => {
      if (err) return res.json({ message: "Token verification failed" }).sendStatus(403)
      if(urlNeedAdmin(req.originalUrl)){
        const user:UserInterface[] = await getUserById(userId as string) as unknown as UserInterface[]
        console.log(user)
        if (user[0].isadmin){
          next()
        }else{
          res.json({ message: "allow only for admin" }).sendStatus(406)
        }
      }else{
        next()
      }})
  }

  export const getUser = async (token:string) => {
    try {
      if (token) {
        const user = Jwt.verify(token, process.env.SECRET_TOKEN_KEY as string);
        return user;
      }
      return null;
    } catch (error) {
      return null;
    }
  };
  

  

  // export const verifyAdminToken=(req:Request, res:Response, next:NextFunction) => {
  //   const token = req.headers['authorization']
  //   if (token == null) {
  //       return res.json( "no token found" ).sendStatus(401)
  //   }
  //   const secretKey:string=process.env.SECRET_TOKEN_KEY as string
  //   Jwt.verify(token,secretKey , (err, user: UserInterface | unknown ) => {
  //     if (err){
  //       return res.json({ message: "Token verification failed" }).sendStatus(403)
  //     }else if((user as UserInterface).isadmin){
  //       req.body.user = user as UserInterface
  //       next()
  //     }else{
  //       return res.json({ message: "allow only for admin" }).sendStatus(406)
  //     }
  //   })
  // }
//   export const refreshTokens:string[] = [];

//   export const refreshToken = (req:Request, res:Response) => {
//       const refreshToken = req.body.refreshToken
//       if (refreshToken == null){
//          return res.sendStatus(401)
//       }
//       if (!refreshTokens.includes(refreshToken)) {
//         return res.sendStatus(403)
//       }
//       const secretKey:string=process.env.SECRET_REFRESH_TOKEN_KEY as string
//       Jwt.verify(refreshToken, secretKey, (err:unknown, user:UserInterface | unknown) => {
//         if (err) {
//           return res.sendStatus(403);
//         }
//         const accessToken = generateAccessToken(user as UserInterface);
//         res.json({ accessToken: accessToken });
//       });
// }
// export const generateRefreshToken=(user:UserInterface) => {
//   const secretKey:string=process.env.SECRET_REFRESH_TOKEN_KEY as string
//   return Jwt.sign(user,secretKey)
// }

