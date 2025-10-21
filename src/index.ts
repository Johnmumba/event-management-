import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.routes.js'
import eventRoutes from './routes/event.routes.js'
import rsvpRoutes from './routes/rsvp.routes.js'
import notificationRoutes from './routes/notification.routes.js'

const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

// Create app without the problematic routes first
const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: 'Event Management API',
        version: '1.0.0',
        description: 'Complete event management system'
      }
    }
  }))
  
  // API routes first
  .use(authRoutes)
  .use(eventRoutes)
  .use(rsvpRoutes)
  .use(notificationRoutes)
  
  .get('/health', async () => {
    try {
      await prisma.$queryRaw`SELECT 1`
      return { 
        status: 'OK', 
        database: 'Connected',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return { status: 'Error', database: 'Disconnected' }
    }
  })

// Now add static routes in a way that avoids the bug
const server = app
  .get('/', () => {
    return Bun.file('event-frontend/index.html')
  })
  .get('/styles.css', () => {
    return Bun.file('event-frontend/styles.css')
  })
  .get('/app.js', () => {
    return Bun.file('event-frontend/app.js')
  })
  .listen(PORT)

console.log('=========================================')
console.log(`🚀 Event Management App - ${process.env.NODE_ENV || 'development'}`)
console.log(`📍 Server running on port ${PORT}`)
console.log('📚 API Docs: /swagger')
console.log('❤️  Health: /health')
console.log('=========================================')