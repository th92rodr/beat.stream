export interface DTOFullUser {
  id: string
  email: string
  emailVerified: boolean
  role: string
  accountStatus: string
  authProvider: string
  username?: string
  passwordHash?: string
  githubId?: number
  githubUsername?: string
  fullName?: string
  country?: string
  birthdate?: Date
  profilePictureUrl?: string
  languagePreference?: string
  timezone?: string
  lastPasswordResetAt?: Date
  lastLogin?: Date
  lastLoginIp?: string
  lastLoginLocation?: string
  createdAt: Date
  updatedAt: Date
}

export interface DTOCreateUser {
  email: string
  authProvider: string
  username?: string
  passwordHash?: string
  githubId?: number
  githubUsername?: string
}

export interface DTOUpdateUserAdditionalInfo {
  id: string
  emailVerified?: boolean
  fullName?: string
  country?: string
  birthdate?: Date
  profilePictureUrl?: string
  languagePreference?: string
  timezone?: string
}

export interface DTOUpdateUserLastLoginInfo {
  id: string
  date: Date
  ip: string
  location: string
}

export interface DTODeleteUser {
  id: string
  date: Date
}
