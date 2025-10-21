import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

const app = new Elysia()

// Simple file serving that works
.get('/', async () => {
  try {
    const html = await readFile(join(process.cwd(), 'event-frontend', 'index.html'), 'utf-8')
    return html
  } catch (error) {
    return '<h1>Event Management App - Backend Running</h1><p><a href="/health">Health Check</a></p>'
  }
})

.get('/styles.css', async () => {
  try {
    const css = await readFile(join(process.cwd(), 'event-frontend', 'styles.css'), 'utf-8')
    return css
  } catch (error) {
    return 'body { font-family: Arial; padding: 20px; }'
  }
})

.get('/app.js', async () => {
  try {
    const js = await readFile(join(process.cwd(), 'event-frontend', 'app.js'), 'utf-8')
    return js
  } catch (error) {
    return 'console.log("Event App Loaded")'
  }
})

// Health check
.get('/health', async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { 
      status: 'OK', 
      database: 'Connected',
      message: 'Event Management App is running'
    }
  } catch (error) {
    return { status: 'Error', database: 'Disconnected' }
  }
})

.listen(PORT)

console.log(`🚀 Server running on http://localhost:${PORT}`)