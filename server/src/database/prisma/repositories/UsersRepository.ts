import { AuthProvider, type PrismaClient, type User } from '@prisma/client'

import type {
  DTOCreateUser,
  DTODeleteUser,
  DTOUpdateUserAdditionalInfo,
  DTOUpdateUserLastLoginInfo,
} from '@/database/common/dtos/users'
import type { IUsersRepository } from '@/database/common/repositories/IUsersRepository'

export class UsersRepository implements IUsersRepository {
  private db: PrismaClient

  constructor(db: PrismaClient) {
    this.db = db
  }

  public async findById(id: string): Promise<Partial<User> | null> {
    return this.db.user.findUnique({
      where: { id },
      select: {},
    })
  }

  public async findByEmail(email: string): Promise<Partial<User> | null> {
    return this.db.user.findUnique({
      where: { email },
      select: {},
    })
  }

  public async findByUsername(username: string): Promise<Partial<User> | null> {
    return this.db.user.findUnique({
      where: { username },
      select: {},
    })
  }

  public async check(id: string): Promise<boolean> {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {},
    })

    if (user) {
      return true
    }

    return false
  }

  public async checkByEmailOrUsername(email: string, username: string): Promise<boolean> {
    const user = await this.db.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: {},
    })

    if (user) {
      return true
    }

    return false
  }

  public async create({
    email,
    authProvider,
    username,
    passwordHash,
    githubId,
    githubUsername,
  }: DTOCreateUser): Promise<string> {
    const { id } = await this.db.user.create({
      data: {
        email,
        authProvider: <AuthProvider>AuthProviderMapProxy.get(authProvider),
        username,
        passwordHash,
        githubId,
        githubUsername,
      },
      select: { id: true },
    })

    return id
  }

  public async update({ id, ...data }: DTOUpdateUserAdditionalInfo): Promise<void> {
    await this.db.user.update({
      where: { id },
      data,
      select: {},
    })
  }

  public async updateLastLogin({
    id,
    date,
    ip,
    location,
  }: DTOUpdateUserLastLoginInfo): Promise<void> {
    await this.db.user.update({
      where: { id },
      data: {
        lastLogin: date,
        lastLoginIp: ip,
        lastLoginLocation: location,
      },
      select: {},
    })
  }

  public async delete({ id, date }: DTODeleteUser): Promise<void> {
    await this.db.user.update({
      where: { id },
      data: {
        accountStatus: 'DELETED',
        deletedAt: date,
      },
      select: {},
    })
  }
}

const AuthProviderMap = new Map<string, AuthProvider>([
  ['EMAIL', AuthProvider.EMAIL],
  ['GITHUB', AuthProvider.GITHUB],
])

const AuthProviderMapProxy = new Proxy(AuthProviderMap, {
  get(map, key): AuthProvider {
    const keyStr = key.toString()
    return <AuthProvider>(map.has(keyStr) ? map.get(keyStr) : map.get('EMAIL'))
  },
})
