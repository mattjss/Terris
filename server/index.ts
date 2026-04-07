import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { registerRoutes } from './routes/registerRoutes.js'

const port = Number(process.env.PORT || 3001) || 3001

const fastify = Fastify({ logger: true })
await fastify.register(cors, { origin: true })
registerRoutes(fastify)

try {
  await fastify.listen({ port, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
