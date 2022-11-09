import * as jwt from "jsonwebtoken";
import config from "config";

import { DecodedUserToken } from "../types/user";

export function decodeUserToken(token: string): DecodedUserToken {
  const decoded: any = jwt.verify(token, config.get("jwtAuthPrivateKey"));
  return {
    id: decoded._id,
    roles: decoded.roles,
    iat: decoded.iat,
    exp: decoded.exp,
  };
}
