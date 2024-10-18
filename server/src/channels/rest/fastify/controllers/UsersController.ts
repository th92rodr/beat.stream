import type { FastifyReply, FastifyRequest } from 'fastify'

import type { DTOCreateUser, DTOLogin, DTOUpdateUser } from '@/channels/rest/dtos'

export class UsersController {
  public login = async (request: FastifyRequest<{ Body: DTOLogin }>, reply: FastifyReply) => {
    const { email, password } = request.body

    // implement logic...

    return reply.status(200).send({ token })
  }

  public read = async (_: FastifyRequest, reply: FastifyReply) => {
    // implement logic...

    return reply.status(200).send({ user })
  }

  public create = async (request: FastifyRequest<{ Body: DTOCreateUser }>, reply: FastifyReply) => {
    const { email, username, password } = request.body

    // implement logic...

    return reply.status(201).send({ id })
  }

  public update = async (request: FastifyRequest<{ Body: DTOUpdateUser }>, reply: FastifyReply) => {
    const { fullName, country, birthdate, languagePreference, timezone } = request.body

    // implement logic...

    return reply.status(200).send()
  }

  public verifyEmail = async (_: FastifyRequest, reply: FastifyReply) => {
    // implement logic...

    return reply.status(200).send()
  }

  public delete = async (_: FastifyRequest, reply: FastifyReply) => {
    // implement logic...

    return reply.status(200).send()
  }
}
