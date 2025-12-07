import { PrismaClient } from '@prisma/client'

// Konfigurasi untuk Prisma 7+
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./dev.db'
    }
  }
})

export { prisma }
export type PrismaClientType = typeof prisma