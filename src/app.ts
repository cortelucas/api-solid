import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'

export const app = fastify()

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Lucas S. Corte',
    email: 'corte1994.lc@gmail.com',
  },
})
