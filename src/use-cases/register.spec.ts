import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const newUser = {
      name: 'Any Name',
      email: 'any_email@corte.tech',
      password: 'any_password',
    }

    const { user } = await sut.execute(newUser)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password open registration', async () => {
    const newUser = {
      name: 'Any Name',
      email: 'any.name@corte.tech',
      password: 'any_password',
    }

    const { user } = await sut.execute(newUser)

    const isPasswordCorrectlyHashed = await compare(
      newUser.password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'any_email@corte.tech'

    const newUser = {
      name: 'Any Name',
      email,
      password: 'any_password',
    }

    await sut.execute(newUser)

    await expect(() => sut.execute(newUser)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
