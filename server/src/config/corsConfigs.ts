import { allowedOrigins } from "./allowedOrigins"
import { Request } from "express"; 


export const corsConfigs = (req:Request,callback:(err: Error | null, corsOptions: object) => void) => {
    
    let corsOptions:object ;

    if (allowedOrigins.includes(String(req.header('Origin')))) {
        corsOptions = { origin: true } 
      } else {
        corsOptions = { origin: false } 
        throw new Error('origin not allowed by Cors')
      }
      callback(null, corsOptions) 
    }

