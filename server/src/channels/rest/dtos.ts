export interface DTOLogin {
  email: string
  password: string
}

export interface DTOCreateUser {
  email: string
  username: string
  password: string
}

export interface DTOUpdateUser {
  fullName?: string
  country?: string
  birthdate?: Date
  languagePreference?: string
  timezone?: string
}
