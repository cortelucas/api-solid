import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate use case', () => {
  it('should be able to authenticate', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(userRepository)

    await userRepository.create({
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
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(userRepository)

    await expect(() =>
      sut.execute({
        email: 'any@email.com',
        password: 'any_password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
