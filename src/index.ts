import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { join, extname } from 'path'
import { jwt } from '@elysiajs/jwt'
import { cors } from '@elysiajs/cors'

const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

const app = new Elysia()
  .use(cors()) // Enable CORS for frontend-backend communication
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    })
  )

// Serve ALL frontend files dynamically
.get('/*', async ({ request }) => {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  // Skip API routes
  if (pathname.startsWith('/api/')) {
    return new Response('Not found', { status: 404 })
  }
  
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

// Authentication endpoints
// User Signup
.post('/api/auth/signup', async ({ body, jwt }) => {
  try {
    const { email, password, name } = body as any

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { success: false, message: 'User already exists' }
    }

    // Hash password and create user
    const hashedPassword = await Bun.password.hash(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })

    // Generate JWT token
    const token = await jwt.sign({
      userId: user.id,
      email: user.email
    })

    return {
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  } catch (error) {
    return { success: false, message: 'Error creating user' }
  }
})

// User Login
.post('/api/auth/login', async ({ body, jwt }) => {
  try {
    const { email, password } = body as any

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return { success: false, message: 'Invalid credentials' }
    }

    // Verify password
    const isValidPassword = await Bun.password.verify(password, user.password)
    if (!isValidPassword) {
      return { success: false, message: 'Invalid credentials' }
    }

    // Generate JWT token
    const token = await jwt.sign({
      userId: user.id,
      email: user.email
    })

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  } catch (error) {
    return { success: false, message: 'Error during login' }
  }
})

// Protected route example
.get('/api/auth/me', async ({ jwt, request }) => {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return { success: false, message: 'No token provided' }
    }

    const token = authHeader.substring(7)
    const payload = await jwt.verify(token)

    if (!payload) {
      return { success: false, message: 'Invalid token' }
    }

    const user = await prisma.user.findUnique({
      where: { id: (payload as any).userId },
      select: { id: true, email: true, name: true }
    })

    if (!user) {
      return { success: false, message: 'User not found' }
    }

    return { success: true, user }
  } catch (error) {
    return { success: false, message: 'Authentication failed' }
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