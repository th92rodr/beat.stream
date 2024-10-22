import { AuthProvider, type PrismaClient } from '@prisma/client'

import { ClientError } from '@/client-error'
import type {
  DTOCreateUser,
  DTODeleteUser,
  DTOFullUser,
  DTOUpdateUserAdditionalInfo,
  DTOUpdateUserLastLoginInfo,
} from '@/database/common/dtos/users'
import type { IUsersRepository } from '@/database/common/repositories/IUsersRepository'

export class UsersRepository implements IUsersRepository {
  private db: PrismaClient

  constructor(db: PrismaClient) {
    this.db = db
  }

  public async findById(id: string): Promise<DTOFullUser> {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        role: true,
        accountStatus: true,
        authProvider: true,
        username: true,
        passwordHash: true,
        githubId: true,
        githubUsername: true,
        fullName: true,
        country: true,
        birthdate: true,
        profilePictureUrl: true,
        languagePreference: true,
        timezone: true,
        lastPasswordResetAt: true,
        lastLogin: true,
        lastLoginIp: true,
        lastLoginLocation: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new ClientError('User does not exist.')
    }

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role,
      accountStatus: user.accountStatus,
      authProvider: user.authProvider,
      username: user.username || undefined,
      passwordHash: user.passwordHash || undefined,
      githubId: user.githubId || undefined,
      githubUsername: user.githubUsername || undefined,
      fullName: user.fullName || undefined,
      country: user.country || undefined,
      birthdate: user.birthdate || undefined,
      profilePictureUrl: user.profilePictureUrl || undefined,
      languagePreference: user.languagePreference || undefined,
      timezone: user.timezone || undefined,
      lastPasswordResetAt: user.lastPasswordResetAt || undefined,
      lastLogin: user.lastLogin || undefined,
      lastLoginIp: user.lastLoginIp || undefined,
      lastLoginLocation: user.lastLoginLocation || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  public async check(id: string): Promise<boolean> {
    const user = await this.db.user.findUnique({
      where: { id },
      select: { id: true },
    })

    if (user) {
      return true
    }

    return false
  }

  public async checkByEmailOrUsername(email: string, username: string): Promise<boolean> {
    const user = await this.db.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { id: true },
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
    })
  }

  public async delete({ id, date }: DTODeleteUser): Promise<void> {
    await this.db.user.update({
      where: { id },
      data: {
        accountStatus: 'DELETED',
        deletedAt: date,
      },
    })
  }
}

const AuthProviderMap = new Map<string, AuthProvider>([
  ['EMAIL', AuthProvider.EMAIL],
  ['GITHUB', AuthProvider.GITHUB],
])

const AuthProviderMapProxy = new Proxy(AuthProviderMap, {
  get(map, prop: string) {
    if (typeof map.get === 'function' && prop === 'get') {
      return (key: string) => {
        return map.has(key) ? map.get(key) : map.get('EMAIL')
      }
    }
    return map[prop as keyof Map<string, AuthProvider>]
  },
})
