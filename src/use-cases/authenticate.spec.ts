import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'user_name',
      email: 'any@email.com',
      password_hash: await hash('any_password', 6),
    })

    const { user } = await sut.execute({
      email: 'any@email.com',
      password: 'any_password',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'any@email.com',
        password: 'any_password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'user_name',
      email: 'any@email.com',
      password_hash: await hash('any_password', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'any@email.com',
        password: 'any_password22',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
