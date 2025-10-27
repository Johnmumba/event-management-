import { Elysia } from 'elysia'
import { jwtUtils } from '../utils/jwt.utils.js'

export const authMiddleware = new Elysia()
  .derive({ as: 'scoped' }, async ({ headers }: { headers: any }) => {
    const authHeader = headers.authorization
    
    if (!authHeader?.startsWith('Bearer ')) {
      return { user: null }
    }

    const token = authHeader.slice(7)
    
    try {
      const decoded = jwtUtils.verify(token) as any
      return { user: decoded }
    } catch {
      return { user: null }
    }
  })