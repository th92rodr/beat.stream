import type { User } from '@prisma/client'

import type {
  DTOCreateUser,
  DTODeleteUser,
  DTOUpdateUserAdditionalInfo,
  DTOUpdateUserLastLoginInfo,
} from '@/database/common/dtos/users'

export interface IUsersRepository {
  findById(id: string): Promise<Partial<User> | null>
  findByEmail(email: string): Promise<Partial<User> | null>
  findByUsername(username: string): Promise<Partial<User> | null>

  check(id: string): Promise<boolean>
  checkByEmailOrUsername(email: string, username: string): Promise<boolean>

  create(data: DTOCreateUser): Promise<string>

  update(data: DTOUpdateUserAdditionalInfo): Promise<void>
  updateLastLogin(data: DTOUpdateUserLastLoginInfo): Promise<void>

  delete(data: DTODeleteUser): Promise<void>
}
