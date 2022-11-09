import * as jwt from "jsonwebtoken";
import config from "config";

export default (req: any, res: any, next: any) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res
        .status(401)
        .send({ message: "Access denied! No authorization token provided." });

    const decoded = jwt.verify(token, config.get("jwtAuthPrivateKey"));
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(400).send({ message: "Authorization token: " + err.message });
  }
};
