import { Application, NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { PermissionFlag } from "../common/enums/common.permissionflag.enum";
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import commonPermissionMiddleware from "../common/middleware/common.permission.middleware";
import usersController from "./controllers/users.controller";
import usersMiddleware from "./middleware/users.middleware";

export class UserRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "UsersRoutes");
  }
  configureRoutes(): Application {
    this.app
      .route("/users")
      .get(
        jwtMiddleware.validJWTNeeded,
        commonPermissionMiddleware.permissionFlagRequired(
          PermissionFlag.ADMIN_PERMISSION
        ),
        usersController.listUsers
      )
      .post(
        body("email").isEmail(),
        body("password")
          .isLength({ min: 5 })
          .withMessage("Must include password (5+ characters)"),
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        usersMiddleware.validateSameEmailDoesntExist,
        usersController.createUser
      );

    this.app.param("userId", usersMiddleware.extractUserId);

    this.app
      .route("/users/:userId")
      .all(
        usersMiddleware.validateUserExists,
        jwtMiddleware.validJWTNeeded,
        commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
      )
      .get(usersController.getUserById)
      .delete(usersController.removeUser);

    this.app.put(`/users/:userId`, [
      body("email").isEmail(),
      body("password")
        .isLength({ min: 5 })
        .withMessage("Must include password (5+ characters)"),
      body("firstName").isString(),
      body("lastName").isString(),
      body("permissionFlags").isInt(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersMiddleware.validateSameEmailBelongToSameUser,
      usersMiddleware.userCantChangePermission,
      commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      commonPermissionMiddleware.permissionFlagRequired(
        PermissionFlag.PAID_PERMISSION
      ),
      usersController.put,
    ]);

    this.app.patch(`/users/:userId`, [
      body("email").isEmail().optional(),
      body("password")
        .isLength({ min: 5 })
        .withMessage("Password must be 5+ characters")
        .optional(),
      body("firstName").isString().optional(),
      body("lastName").isString().optional(),
      body("permissionFlags").isInt().optional(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersMiddleware.validatePatchEmail,
      commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      commonPermissionMiddleware.permissionFlagRequired(
        PermissionFlag.PAID_PERMISSION
      ),
      usersController.patch,
    ]);

    this.app.put(`/users/:userId/permissionLevel/:permissionLevel`, [
      jwtMiddleware.validJWTNeeded,
      commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      commonPermissionMiddleware.permissionFlagRequired(
        PermissionFlag.FREE_PERMISSION
      ),
      usersController.updatePermissionLevel,
    ]);

    return this.app;
  }
}
