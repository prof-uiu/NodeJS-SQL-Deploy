import jwt from "jsonwebtoken";
import { GetUserById } from "../controller/user.js";

const SECRET = process.env.DATABASE;

export default async function isAuth(req, res, next) {
  try {
    const token = req.headers["authorization"] || "";

    if (!token) {
      res.status(401).json({ message: "Token invalid" });
      res.end();
      return;
    }

    const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET);

    const user = await GetUserById(decoded.id);

    if (!user) {
      res.status(401).json({ message: "Token invalid" });
      res.end();
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: error });
    res.end();
    return;
  }
}
