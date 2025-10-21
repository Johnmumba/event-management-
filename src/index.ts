import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.routes.js'
import eventRoutes from './routes/event.routes.js'
import rsvpRoutes from './routes/rsvp.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

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
  
  // Serve frontend files - FIXED PATHS
  .get('/', async () => {
    try {
      // Try multiple possible paths
      const paths = [
        join(process.cwd(), 'event-frontend', 'index.html'),
        join(__dirname, '..', 'event-frontend', 'index.html'),
        join(process.cwd(), 'index.html')
      ]
      
      let html = ''
      for (const path of paths) {
        try {
          html = await readFile(path, 'utf-8')
          console.log('Successfully loaded HTML from:', path)
          break
        } catch (e) {
          console.log('Failed to load from:', path)
        }
      }
      
      if (!html) {
        // Fallback: serve a basic HTML page
        html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Event Management App</title>
            <style>
                body { font-family: Arial; padding: 40px; text-align: center; background: #f5f5f5; }
                .container { max-width: 600px; margin: 50px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #333; }
                button { padding: 15px 30px; margin: 10px; font-size: 16px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
                #result { margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎉 Event Management App</h1>
                <p>Backend is running! Frontend files being optimized...</p>
                <div>
                    <button onclick="testAPI()">Test Backend API</button>
                    <button onclick="testHealth()">Test Health Check</button>
                </div>
                <div id="result"></div>
            </div>
            <script>
                const baseUrl = window.location.origin;
                
                async function testAPI() {
                    try {
                        const response = await fetch(baseUrl + '/health');
                        const data = await response.json();
                        document.getElementById('result').innerHTML = 
                            '<h3>✅ Backend Working!</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                    } catch (error) {
                        document.getElementById('result').innerHTML = '❌ Error: ' + error.message;
                    }
                }
                
                async function testHealth() {
                    try {
                        const response = await fetch(baseUrl + '/health');
                        const data = await response.json();
                        document.getElementById('result').innerHTML = 
                            '✅ <strong>Health:</strong> ' + data.status + '<br>' +
                            '✅ <strong>Database:</strong> ' + data.database + '<br>' +
                            '✅ <strong>Environment:</strong> ' + data.environment;
                    } catch (error) {
                        document.getElementById('result').innerHTML = '❌ Error: ' + error.message;
                    }
                }
            </script>
        </body>
        </html>
        `
      }
      
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      })
    } catch (error: any) {
      console.error('Error serving index.html:', error.message)
      return new Response('Frontend error: ' + error.message, { status: 500 })
    }
  })
  
  .get('/styles.css', async () => {
    try {
      const paths = [
        join(process.cwd(), 'event-frontend', 'styles.css'),
        join(__dirname, '..', 'event-frontend', 'styles.css')
      ]
      
      let css = ''
      for (const path of paths) {
        try {
          css = await readFile(path, 'utf-8')
          break
        } catch (e) {
          // Continue to next path
        }
      }
      
      if (!css) {
        css = 'body { font-family: Arial; padding: 20px; }'
      }
      
      return new Response(css, {
        headers: { 'Content-Type': 'text/css' }
      })
    } catch (error: any) {
      return new Response('body { font-family: Arial; padding: 20px; }', {
        headers: { 'Content-Type': 'text/css' }
      })
    }
  })
  
  .get('/app.js', async () => {
    try {
      const paths = [
        join(process.cwd(), 'event-frontend', 'app.js'),
        join(__dirname, '..', 'event-frontend', 'app.js')
      ]
      
      let js = ''
      for (const path of paths) {
        try {
          js = await readFile(path, 'utf-8')
          break
        } catch (e) {
          // Continue to next path
        }
      }
      
      if (!js) {
        js = 'console.log("Event Management App Loaded");'
      }
      
      return new Response(js, {
        headers: { 'Content-Type': 'application/javascript' }
      })
    } catch (error: any) {
      return new Response('console.log("Event Management App Loaded");', {
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
console.log('📚 API Docs: /swagger')
console.log('❤️  Health: /health')
console.log('=========================================')