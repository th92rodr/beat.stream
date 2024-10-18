import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import Fastify, { type FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { ZodError, z } from 'zod'

import type { IRestServer } from '@/channels/rest/IRestServer'
import { UsersController } from '@/channels/rest/fastify/controllers/UsersController'
import { ClientError } from '@/client-error'
import { env } from '@/env'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export class FastifyRestServer implements IRestServer {
  private server: FastifyInstance

  private usersController: UsersController

  constructor() {
    this.server = Fastify({
      connectionTimeout: env.CONNECTION_TIMEOUT, // The amount of time allowed for a client to establish a connection with the server.
      requestTimeout: env.REQUEST_TIMEOUT, // The maximum amount of time the server will wait for a complete HTTP request from the client.

      logger: {
        level: env.NODE_ENV === 'development' ? 'info' : 'error',
        // file: './server.log',
      },
    })

    this.usersController = new UsersController()
  }

  public async start() {
    if (this.server.server.listening) {
      console.log('HTTP server already started.')
      return
    }

    this.registerPlugins()
    this.registerRoutes()

    try {
      await this.server.listen({ host: env.HOST, port: env.PORT })
      console.log(`HTTP server listening at: http://${env.HOST}:${env.PORT}`)
    } catch (error) {
      this.server.log.error('Failed starting HTTP server.')
      throw error
    }
  }

  public async stop() {
    if (!this.server.server.listening) {
      console.log('HTTP server already stopped.')
      return
    }

    try {
      await this.server.close()
      console.log('HTTP server stopped.')
    } catch (error) {
      this.server.log.error('Failed stoping HTTP server.')
      throw error
    }
  }

  private registerPlugins() {
    // Setup CORS
    this.server.register(cors, {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'User-Agent',
        'Origin',
        // 'Access-Control-Allow-Origin', // Used in preflight requests to specify which domains can access the resource.

        // 'Referer', // Useful for security checks to know where the request is coming from.
        // 'Referrer-Policy',

        // 'Cache-Control', // Controls cache behavior between the client and server, such as conditional requests.
        // 'If-None-Match',
      ],
      exposedHeaders: [
        'Authorization', // Exposing the Authorization header allows clients to see and use tokens or credentials returned in responses for subsequent authenticated requests.

        // 'Location', // Exposes the Location header, typically used in redirects or when resources are created (e.g., 201 Created response).

        // 'X-RateLimit-Limit', // Useful in APIs to expose rate-limiting information, allowing clients to know how many requests they can make before hitting the rate limit.
        // 'X-RateLimit-Remaining',
        // 'X-RateLimit-Reset',

        // 'Retry-After', // Exposes the Retry-After header to indicate when a client can retry a request after being rate-limited or after a service has been temporarily unavailable.

        // 'ETag', // Used for caching, the ETag header can be exposed to allow clients to validate cached resources with the server.

        // 'Content-Disposition', // Allows the client to access the Content-Disposition header, typically used when downloading files to determine how they should be saved on the client side (e.g., filename).

        // 'Cache-Control', // Used to control caching behavior, exposing this header allows clients to see caching directives sent by the server.

        // 'Link', // Exposes the Link header, often used in pagination to indicate the next or previous pages of data in an API.
      ],

      // Specifies how long (in seconds) the results of a preflight request (OPTIONS request) can be cached.
      // maxAge: 86400, // Cache preflight request for 24 hours
    })

    this.server.register(helmet)

    // Setup rate limit
    this.server.register(rateLimit, {
      max: env.RATE_LIMIT_MAX_REQUESTS,
      timeWindow: env.RATE_LIMIT_TIME_WINDOW,
      ban: env.RATE_LIMIT_BAN,
      onBanReach: (_, key) => {
        console.log(`Client with IP ${key} has been banned.`)
      },
      errorResponseBuilder: (_, context) => {
        if (context.ban) {
          return {
            statusCode: 429,
            error: 'Too Many Requests',
            message: 'Your IP is banned for 5 minutes. Try again later.',
          }
        }
        return {
          statusCode: 429,
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${context.after} seconds.`,
        }
      },
    })

    // Register error handler
    this.server.setErrorHandler(this.errorHandler)

    // Register request inputs validator
    this.server.setValidatorCompiler(validatorCompiler)
    this.server.setSerializerCompiler(serializerCompiler)
  }

  private errorHandler: FastifyErrorHandler = (error, _, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Invalid input',
        errors: error.flatten().fieldErrors,
      })
    }

    if (error instanceof ClientError) {
      return reply.status(400).send({
        message: error.message,
      })
    }

    console.error('Server error:', error)

    return reply.status(500).send({ message: 'Internal server error' })
  }

  private registerRoutes() {
    this.server.route({
      method: 'GET',
      url: '/users',
      handler: this.usersController.read,
    })

    this.server.route({
      method: 'POST',
      url: '/users',
      handler: this.usersController.create,
      schema: {
        body: z.object({
          email: z.string().email().max(50),
          username: z.string().min(3).max(50),
          password: z.string().min(10).max(100),
        }),
        response: z.object({
          id: z.string(),
        }),
      },
    })

    this.server.route({
      method: 'PATCH',
      url: '/users',
      handler: this.usersController.update,
      schema: {
        body: z.object({
          fullName: z.string().max(50).optional(),
          country: z.string().max(20).optional(),
          birthdate: z.date().optional(), // maybe use string
          languagePreference: z.string().max(2).optional(),
          timezone: z.string().max(20).optional(),
        }),
      },
    })

    this.server.route({
      method: 'DELETE',
      url: '/users',
      handler: this.usersController.delete,
    })
  }
}
