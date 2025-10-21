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
  
  // Serve frontend files - SIMPLIFIED RESPONSE
  .get('/', async ({ set }) => {
    try {
      const html = await readFile(join(process.cwd(), 'event-frontend', 'index.html'), 'utf-8')
      set.headers['Content-Type'] = 'text/html'
      return html
    } catch (error: any) {
      console.error('Error serving index.html:', error.message)
      
      // Fallback HTML
      set.headers['Content-Type'] = 'text/html'
      return `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Event Management App</title>
          <style>
              body { font-family: Arial; padding: 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; color: white; }
              .container { max-width: 600px; margin: 100px auto; background: rgba(255,255,255,0.1); padding: 40px; border-radius: 15px; backdrop-filter: blur(10px); }
              h1 { font-size: 2.5rem; margin-bottom: 20px; }
              button { padding: 15px 30px; margin: 10px; font-size: 16px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; transition: transform 0.3s; }
              button:hover { transform: translateY(-2px); background: #45a049; }
              #result { margin-top: 20px; padding: 20px; background: rgba(255,255,255,0.2); border-radius: 8px; text-align: left; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>🎉 Event Management App</h1>
              <p>Backend is running! Testing frontend loading...</p>
              <div>
                  <button onclick="testHealth()">Test Health Check</button>
                  <button onclick="testEvents()">Test Events API</button>
                  <button onclick="testSwagger()">View API Docs</button>
              </div>
              <div id="result"></div>
          </div>
          <script>
              const baseUrl = window.location.origin;
              
              async function testHealth() {
                  try {
                      const response = await fetch(baseUrl + '/health');
                      const data = await response.json();
                      document.getElementById('result').innerHTML = 
                          '<h3>✅ Backend Working!</h3>' +
                          '<strong>Status:</strong> ' + data.status + '<br>' +
                          '<strong>Database:</strong> ' + data.database + '<br>' +
                          '<strong>Environment:</strong> ' + data.environment + '<br>' +
                          '<strong>Timestamp:</strong> ' + data.timestamp;
                  } catch (error) {
                      document.getElementById('result').innerHTML = '❌ Error: ' + error.message;
                  }
              }
              
              async function testEvents() {
                  try {
                      const response = await fetch(baseUrl + '/events');
                      const data = await response.json();
                      if (data.error) {
                          document.getElementById('result').innerHTML = 'Events API: ' + data.error + ' (Login required)';
                      } else {
                          document.getElementById('result').innerHTML = 'Events API: Working! ' + (data.events ? data.events.length + ' events' : 'No events');
                      }
                  } catch (error) {
                      document.getElementById('result').innerHTML = '❌ Events Error: ' + error.message;
                  }
              }
              
              function testSwagger() {
                  window.open(baseUrl + '/swagger', '_blank');
              }
              
              console.log('Event Management App - Fallback Loaded');
          </script>
      </body>
      </html>
      `
    }
  })
  
  .get('/styles.css', async ({ set }) => {
    try {
      const css = await readFile(join(process.cwd(), 'event-frontend', 'styles.css'), 'utf-8')
      set.headers['Content-Type'] = 'text/css'
      return css
    } catch (error: any) {
      console.error('Error serving CSS:', error.message)
      set.headers['Content-Type'] = 'text/css'
      return 'body { font-family: Arial; padding: 20px; }'
    }
  })
  
  .get('/app.js', async ({ set }) => {
    try {
      const js = await readFile(join(process.cwd(), 'event-frontend', 'app.js'), 'utf-8')
      set.headers['Content-Type'] = 'application/javascript'
      return js
    } catch (error: any) {
      console.error('Error serving JS:', error.message)
      set.headers['Content-Type'] = 'application/javascript'
      return 'console.log("Event Management App Loaded");'
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