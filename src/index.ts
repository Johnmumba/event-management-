import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.routes.js'
import eventRoutes from './routes/event.routes.js'
import rsvpRoutes from './routes/rsvp.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import { swagger } from '@elysiajs/swagger'
import { readFile } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

const app = new Elysia()
  .use(cors())
  .use(swagger())
  
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
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return { status: 'Error', database: 'Disconnected' }
    }
  })
  
  .listen(3000)

console.log('=========================================')
console.log('🚀 Event Management App - FULL STACK READY!')
console.log('📍 Frontend: http://localhost:3000')
console.log('📚 API Docs: http://localhost:3000/swagger')
console.log('❤️  Health: http://localhost:3000/health')
console.log('')
console.log('✅ FEATURES:')
console.log('   🔐 Authentication & JWT')
console.log('   📅 Event Management (Admin/Organizer/Attendee)')
console.log('   ✅ RSVP System')
console.log('   🔔 Real-time Notifications')
console.log('   🎨 Modern Frontend UI')
console.log('=========================================')