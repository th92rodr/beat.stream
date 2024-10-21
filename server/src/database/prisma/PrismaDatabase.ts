import { PrismaClient } from '@prisma/client'
import { PrismaClientInitializationError } from '@prisma/client/runtime/library'

import type { IDatabase } from '@/database/IDatabase'
import { env } from '@/env'

export class PrismaDatabase implements IDatabase {
  private db: PrismaClient | undefined

  public async connect() {
    if (this.db) {
      console.log('Database already connected.')
      return
    }

    try {
      this.db = new PrismaClient({
        datasourceUrl: env.DATABASE_URL,
        log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [],
      })
      await this.db.$connect()
      console.log('Database connected successfully.')
    } catch (error) {
      if (error instanceof PrismaClientInitializationError) {
        console.error('Failed to initialize Prisma Client:', error.message)
      } else {
        console.error('Unexpected error during database connection:', error)
      }
      throw error
    }
  }

  public async disconnect() {
    if (this.db) {
      await this.db.$disconnect()
      console.log('Database disconnected.')
    }
  }
}
