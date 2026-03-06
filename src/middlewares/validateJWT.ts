import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser, userModel } from "../models/userModel";




const validateJWT = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement JWT validation logic
  const authorizationHeader = req.get("authorization");
  if (!authorizationHeader) {
    res.status(403).send("Authorization header is missing");
    return;
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    res.status(403).send("Bearer Token is missing");
    return;
  }

  jwt.verify(token, "E5839F9CC1F75F9D8D99B74C2F6CCF3", async (err, payload) => {
    if (err) {
      res.status(403).send("Invalid token");
      return;
    }

    if (!payload) {
      res.status(403).send("Invalid payload");
      return;
    }

    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
    };

    // Fetch user from database based on the payload
    const user = await userModel.findOne({ email: userPayload.email });
    if (!user) {
      res.status(404).send("no user found");
      return;
    }
    req.user = user;
    next();
  });
};

export default validateJWT;
