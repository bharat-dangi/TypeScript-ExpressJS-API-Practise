import debug from "debug";
import { NextFunction, Request, Response } from "express";
import usersService from "../services/users.service";

const log: debug.IDebugger = debug("app:users-controller");

class UsersMiddleware {
  async validateRequiredUserBodyFields(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.body && req.body.email && req.body.password) {
      next();
    } else {
      res.status(400).send({
        error: `Missing required fields email and password`,
      });
    }
  }

  async validateSameEmailDoesntExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await usersService.getUserByEmail(req.body.email);
    if (user) {
      res.status(400).send({ error: `User email already exists` });
    } else {
      next();
    }
  }

  async validateSameEmailBelongToSameUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (res.locals.user._id === req.params.userId) {
      next();
    } else {
      res.status(400).send({ error: `Invalid email` });
    }
  }

  validatePatchEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.body.email) {
      log("Validating email", req.body.email);

      this.validateSameEmailBelongToSameUser(req, res, next);
    } else {
      next();
    }
  };

  async validateUserExists(req: Request, res: Response, next: NextFunction) {
    const user = await usersService.readById(req.params.userId);
    if (user) {
      res.locals.user = user;
      next();
    } else {
      res.status(404).send({
        error: `User ${req.params.userId} not found`,
      });
    }
  }

  async extractUserId(req: Request, res: Response, next: NextFunction) {
    req.body.id = req.params.userId;
    next();
  }

  async userCantChangePermission(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (
      "permissionFlags" in req.body &&
      req.body.permissionFlags !== res.locals.user.permissionFlags
    ) {
      res.status(400).send({
        errors: ["User cannot change permission flags"],
      });
    } else {
      next();
    }
  }
}

export default new UsersMiddleware();
