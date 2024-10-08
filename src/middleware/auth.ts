import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
    namespace Express {
        interface Request {
            userId: string;
            auth0Id: string;
        }
    }
}


// what this function will do behind the scenes is it will check the authorization header for the bearer token so if you can remember back when we did the front end parts we send the authorization header which has the bearer token in it so this all gets Passes to this function and then this is going to connect up to our 0Auth server behind the scenes and it's going to verify that the token that we get in the request belongs to a logged in user
export const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
});

export const jwtParse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;
  
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.sendStatus(401);
    }
  
    // Bearer lshdflshdjkhvjkshdjkvh34h5k3h54jkh
    const token = authorization.split(" ")[1];
  
    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      const auth0Id = decoded.sub;
  
      const user = await User.findOne({ auth0Id });
  
      if (!user) {
        return res.sendStatus(401);
      }
  
      req.auth0Id = auth0Id as string;
      req.userId = user._id.toString();
      next();
    } catch (error) {
      return res.sendStatus(401);
    }
  };