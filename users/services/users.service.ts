import { CRUD } from "../../common/interfaces/crud.interface";
import usersDao from "../daos/users.dao";
import { CreateUsersDto } from "../dtos/create.users.dto";
import { PatchUsersDto } from "../dtos/patch.users.dto";
import { PutUsersDto } from "../dtos/put.users.dto";

class UsersService implements CRUD {
  async list(limit: number, page: number) {
    return usersDao.getUsers(limit, page);
  }
  async create(resource: CreateUsersDto) {
    return usersDao.addUser(resource);
  }
  async putById(id: string, resource: PutUsersDto): Promise<any> {
    return usersDao.updateUserById(id, resource);
  }
  async readById(id: string) {
    return usersDao.getUserById(id);
  }
  async deleteById(id: string) {
    return usersDao.removeUserById(id);
  }
  async patchById(id: string, resource: PatchUsersDto): Promise<any> {
    return usersDao.updateUserById(id, resource);
  }

  async getUserByEmail(email: string) {
    return usersDao.getUserByEmail(email);
  }

  async getUserByEmailWithPassword(email: string) {
    return usersDao.getUserByEmailWithPassword(email);
  }
}

export default new UsersService();
