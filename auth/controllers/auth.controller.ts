import debug, { IDebugger } from "debug";
import { Request, Response } from "express";
import { defaultConstants } from "../../common/constants/common.default.constants.";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const log: IDebugger = debug("app:auth-controller");

const jwtSecret: string = process.env.JWT_SECRET!;
const tokenExpirationInSeconds: number = parseInt(
  process.env.JWT_EXPIRATION_IN_SECONDS ??
    defaultConstants.JWT_TOKEN_EXPIRATION_IN_SECONDS
);
class AuthController {
  async createJWT(req: Request, res: Response) {
    try {
      const refreshId = req.body.userId + jwtSecret;
      const salt = crypto.createSecretKey(crypto.randomBytes(10));
      const hash = crypto
        .createHmac("sha512", salt)
        .update(refreshId)
        .digest("base64");

      req.body.refreshKey = salt.export();
      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn: tokenExpirationInSeconds,
      });
      return res.status(201).send({ accessToken: token, refreshToken: hash });
    } catch (error) {
      log("createJWT error: %0", error);
      return res.status(500).send();
    }
  }
}

export default new AuthController();
