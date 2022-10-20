import shortid from "shortid";
import debug from "debug";
import { CreateUsersDto } from "../dtos/create.users.dto";
import { PutUsersDto } from "../dtos/put.users.dto";
import { PatchUsersDto } from "../dtos/patch.users.dto";
import mongooseService from "../../common/services/mongoose.service";
import { PermissionFlag } from "../../common/enums/common.permissionflag.enum";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UserDao {
  Schema = mongooseService.getMongoose().Schema;

  userSchema = new this.Schema(
    {
      _id: String,
      email: String,
      password: { type: String, select: false },
      firstName: String,
      lastName: String,
      permissionFlags: Number,
    },
    { id: false }
  );

  User = mongooseService.getMongoose().model("Users", this.userSchema);

  constructor() {
    log("Created new instance of UsersDao");
  }

  async addUser(userFields: CreateUsersDto) {
    const userId = shortid.generate();
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: PermissionFlag.FREE_PERMISSION,
    });
    await user.save();
    return userId;
  }

  async getUserByEmail(email: string) {
    return this.User.findOne({ email: email }).exec();
  }

  async getUserByEmailWithPassword(email: string) {
    return this.User.findOne({ email: email })
      .select("_id email permissionFlags +password")
      .exec();
  }

  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec();
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).exec();
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateUserById(
    userId: string,
    userFields: PatchUsersDto | PutUsersDto
  ) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();

    return existingUser;
  }
}

export default new UserDao();
