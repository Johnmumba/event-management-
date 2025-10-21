import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.routes.js'
import eventRoutes from './routes/event.routes.js'
import rsvpRoutes from './routes/rsvp.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import { readFile } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

const app = new Elysia()
  // Enable CORS manually
  .onRequest(({ request, set }) => {
    const origin = request.headers.get('origin')
    set.headers['Access-Control-Allow-Origin'] = origin || '*'
    set.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    set.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    set.headers['Access-Control-Allow-Credentials'] = 'true'
  })
  .options('*', () => {
    return new Response(null, { status: 204 })
  })
  
  // Serve frontend files
  .get('/', async () => {
    try {
      const html = await readFile(join(process.cwd(), 'event-frontend', 'index.html'), 'utf-8')
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      })
    } catch (error) {
      return new Response('Frontend not found', { status: 404 })
    }
  })
  .get('/styles.css', async () => {
    try {
      const css = await readFile(join(process.cwd(), 'event-frontend', 'styles.css'), 'utf-8')
      return new Response(css, {
        headers: { 'Content-Type': 'text/css' }
      })
    } catch (error) {
      return new Response('CSS not found', { status: 404 })
    }
  })
  .get('/app.js', async () => {
    try {
      const js = await readFile(join(process.cwd(), 'event-frontend', 'app.js'), 'utf-8')
      return new Response(js, {
        headers: { 'Content-Type': 'application/javascript' }
      })
    } catch (error) {
      return new Response('JS not found', { status: 404 })
    }
  })
  
  // API routes
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
  
  .listen(PORT)

console.log('=========================================')
console.log(`🚀 Event Management App - ${process.env.NODE_ENV || 'development'}`)
console.log(`📍 Server running on port ${PORT}`)
console.log('❤️  Health: /health')
console.log('=========================================')