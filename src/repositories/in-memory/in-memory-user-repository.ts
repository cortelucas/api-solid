import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'crypto'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async findUserByEmail(email: string) {
    const user = this.users.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: String(randomUUID()),
      name: data.name,
      email: data.email,
      password_hash: String(data.password_hash),
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}
