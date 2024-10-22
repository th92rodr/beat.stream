import type {
  DTOCreateUser,
  DTODeleteUser,
  DTOFullUser,
  DTOUpdateUserAdditionalInfo,
  DTOUpdateUserLastLoginInfo,
} from '@/database/common/dtos/users'

export interface IUsersRepository {
  findById(id: string): Promise<DTOFullUser>

  check(id: string): Promise<boolean>
  checkByEmailOrUsername(email: string, username: string): Promise<boolean>

  create(data: DTOCreateUser): Promise<string>

  update(data: DTOUpdateUserAdditionalInfo): Promise<void>
  updateLastLogin(data: DTOUpdateUserLastLoginInfo): Promise<void>

  delete(data: DTODeleteUser): Promise<void>
}
