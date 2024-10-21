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
