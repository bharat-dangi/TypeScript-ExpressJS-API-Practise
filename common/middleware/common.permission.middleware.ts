import debug, { IDebugger } from "debug";
import { NextFunction, Request, Response } from "express";
import { PermissionFlag } from "../enums/common.permissionflag.enum";

const log: IDebugger = debug("app:common-permission-middleware");
class CommonPermissionMiddlware {
  permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags);
        if (userPermissionFlags & requiredPermissionFlag) {
          next();
        } else {
          res.status(403).send();
        }
      } catch (error) {
        log(error);
      }
    };
  }

  async onlySameUserOrAdminCanDoThisAction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags);
    if (
      req.params &&
      req.params.userId &&
      req.params.userId === res.locals.jwt.userId
    ) {
      return next();
    } else {
      if (userPermissionFlags & PermissionFlag.ADMIN_PERMISSION) {
        return next();
      } else {
        return res.status(403).send();
      }
    }
  }
}

export default new CommonPermissionMiddlware();
