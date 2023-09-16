import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  findUserByID(id: string): Promise<User | null>
  findUserByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
