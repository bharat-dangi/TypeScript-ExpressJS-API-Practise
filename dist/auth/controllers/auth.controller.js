"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const common_default_constants_1 = require("../../common/constants/common.default.constants.");
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const log = (0, debug_1.default)("app:auth-controller");
const jwtSecret = process.env.JWT_SECRET;
const tokenExpirationInSeconds = parseInt((_a = process.env.JWT_EXPIRATION_IN_SECONDS) !== null && _a !== void 0 ? _a : common_default_constants_1.defaultConstants.JWT_TOKEN_EXPIRATION_IN_SECONDS);
class AuthController {
    createJWT(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshId = req.body.userId + jwtSecret;
                const salt = crypto_1.default.createSecretKey(crypto_1.default.randomBytes(10));
                const hash = crypto_1.default
                    .createHmac("sha512", salt)
                    .update(refreshId)
                    .digest("base64");
                req.body.refreshKey = salt.export();
                const token = jsonwebtoken_1.default.sign(req.body, jwtSecret, {
                    expiresIn: tokenExpirationInSeconds,
                });
                return res.status(201).send({ accessToken: token, refreshToken: hash });
            }
            catch (error) {
                log("createJWT error: %0", error);
                return res.status(500).send();
            }
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXV0aC9jb250cm9sbGVycy9hdXRoLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQXlDO0FBRXpDLCtGQUFvRjtBQUNwRixvREFBNEI7QUFDNUIsZ0VBQStCO0FBRS9CLE1BQU0sR0FBRyxHQUFjLElBQUEsZUFBSyxFQUFDLHFCQUFxQixDQUFDLENBQUM7QUFFcEQsTUFBTSxTQUFTLEdBQVcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFXLENBQUM7QUFDbEQsTUFBTSx3QkFBd0IsR0FBVyxRQUFRLENBQy9DLE1BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsbUNBQ25DLDJDQUFnQixDQUFDLCtCQUErQixDQUNuRCxDQUFDO0FBQ0YsTUFBTSxjQUFjO0lBQ1osU0FBUyxDQUFDLEdBQVksRUFBRSxHQUFhOztZQUN6QyxJQUFJO2dCQUNGLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztnQkFDOUMsTUFBTSxJQUFJLEdBQUcsZ0JBQU0sQ0FBQyxlQUFlLENBQUMsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxJQUFJLEdBQUcsZ0JBQU07cUJBQ2hCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDO3FCQUMxQixNQUFNLENBQUMsU0FBUyxDQUFDO3FCQUNqQixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXBCLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDcEMsTUFBTSxLQUFLLEdBQUcsc0JBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7b0JBQzFDLFNBQVMsRUFBRSx3QkFBd0I7aUJBQ3BDLENBQUMsQ0FBQztnQkFDSCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUN6RTtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbEMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQy9CO1FBQ0gsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxrQkFBZSxJQUFJLGNBQWMsRUFBRSxDQUFDIn0=