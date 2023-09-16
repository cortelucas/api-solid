import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'

describe('Register use case', () => {
  it('should hash user password open registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const newUser = {
      name: 'Any Name',
      email: 'any.name@corte.tech',
      password: 'any_password',
    }

    const { user } = await registerUseCase.execute(newUser)

    const isPasswordCorrectlyHashed = await compare(
      newUser.password,
      user.password_hash,
    )

    console.log(user.password_hash)
    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
