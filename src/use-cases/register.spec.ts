import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists'
import { RegisterUseCase } from './register'

describe('Register use case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const newUser = {
      name: 'Any Name',
      email: 'any_email@corte.tech',
      password: 'any_password',
    }

    const { user } = await registerUseCase.execute(newUser)

    expect(user.id).toEqual(expect.any(String))
  })

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

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'any_email@corte.tech'

    const newUser = {
      name: 'Any Name',
      email,
      password: 'any_password',
    }

    await registerUseCase.execute(newUser)

    await expect(() => registerUseCase.execute(newUser)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
