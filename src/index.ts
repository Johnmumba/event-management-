import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { join, extname } from 'path'

const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

const app = new Elysia()

// Serve ALL frontend files dynamically
.get('/*', async ({ request }) => {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  // Default to index.html for root
  if (pathname === '/') {
    try {
      const html = await readFile(join(process.cwd(), 'event-frontend', 'index.html'), 'utf-8')
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      })
    } catch (error) {
      return new Response('Not found', { status: 404 })
    }
  }

  // Serve other files (CSS, JS, etc.)
  try {
    const filePath = join(process.cwd(), 'event-frontend', pathname)
    const content = await readFile(filePath, 'utf-8')
    
    // Set correct content type
    const ext = extname(pathname)
    const contentTypes: Record<string, string> = {
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.html': 'text/html',
      '.json': 'application/json'
    }
    
    return new Response(content, {
      headers: { 
        'Content-Type': contentTypes[ext] || 'text/plain'
      }
    })
  } catch (error) {
    return new Response('Not found', { status: 404 })
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
console.log(`📁 Serving files from: ${join(process.cwd(), 'event-frontend')}`)