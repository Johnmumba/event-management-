import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.routes.js'
import eventRoutes from './routes/event.routes.js'
import rsvpRoutes from './routes/rsvp.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import { readFile } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

// Get port from environment or default
const PORT = (process?.env?.PORT as string) || '3000'

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
  
  // Serve frontend files using simple file reading
  .get('/', async () => {
    try {
      const html = await readFile(join(process.cwd(), 'event-frontend', 'index.html'), 'utf-8')
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      })
    } catch (error: any) {
      // Fallback HTML
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Event Management</title>
            <style>
                body { font-family: Arial; padding: 40px; text-align: center; }
                .container { max-width: 600px; margin: 100px auto; }
                button { padding: 15px 30px; margin: 10px; font-size: 16px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎉 Event Management App</h1>
                <p>Backend is running! Frontend loading...</p>
                <button onclick="window.open('/swagger', '_blank')">API Docs</button>
                <button onclick="fetch('/health').then(r => r.json()).then(alert)">Health Check</button>
            </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }
  })
  
  .get('/styles.css', async () => {
    try {
      const css = await readFile(join(process.cwd(), 'event-frontend', 'styles.css'), 'utf-8')
      return new Response(css, {
        headers: { 'Content-Type': 'text/css' }
      })
    } catch (error) {
      return new Response('body { font-family: Arial; padding: 20px; }', {
        headers: { 'Content-Type': 'text/css' }
      })
    }
  })
  
  .get('/app.js', async () => {
    try {
      const js = await readFile(join(process.cwd(), 'event-frontend', 'app.js'), 'utf-8')
      return new Response(js, {
        headers: { 'Content-Type': 'application/javascript' }
      })
    } catch (error) {
      return new Response('console.log("Event App Loaded");', {
        headers: { 'Content-Type': 'application/javascript' }
      })
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
        environment: process?.env?.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return { status: 'Error', database: 'Disconnected' }
    }
  })
  
  .listen(parseInt(PORT))

console.log('=========================================')
console.log(`🚀 Event Management App - ${process?.env?.NODE_ENV || 'development'}`)
console.log(`📍 Server running on port ${PORT}`)
console.log('📚 API Docs: /swagger')
console.log('❤️  Health: /health')
console.log('=========================================')