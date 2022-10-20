export interface CreateUsersDto {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  permissionLevel?: number;
}
