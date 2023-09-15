import { app } from '@/app'
import { env } from '@/env'

try {
  app
    .listen({
      host: '0.0.0.0',
      port: env.PORT,
    })
    .then(() => {
      console.log('🚀 HTTP Server Running!')
    })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
