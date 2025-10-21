import { jwtUtils } from '../utils/jwt.utils.js'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const authControllers = {
  async signup({ body }: { body: { email: string; password: string; role?: string } }) {
    try {
      console.log('Signup attempt:', body)
      
      const { email, password, role = 'ATTENDEE' } = body
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        console.log('User already exists:', email)
        return { error: 'User already exists' }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)
      console.log('Password hashed successfully')

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role as any
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true
        }
      })

      console.log('User created:', user)

      // Generate JWT token
      const token = jwtUtils.sign({
        id: user.id,
        email: user.email,
        role: user.role
      })

      console.log('Token generated')

      return {
        message: 'User created successfully',
        token,
        user
      }

    } catch (error: any) {
      console.error('Signup error:', error)
      return { error: 'Internal server error: ' + error.message }
    }
  },

  async login({ body }: { body: { email: string; password: string } }) {
    try {
      console.log('Login attempt:', body.email)
      
      const { email, password } = body

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        console.log('User not found:', email)
        return { error: 'Invalid credentials' }
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        console.log('Invalid password for:', email)
        return { error: 'Invalid credentials' }
      }

      // Generate JWT token
      const token = jwtUtils.sign({
        id: user.id,
        email: user.email,
        role: user.role
      })

      console.log('Login successful:', email)

      return {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }

    } catch (error: any) {
      console.error('Login error:', error)
      return { error: 'Internal server error: ' + error.message }
    }
  }
}