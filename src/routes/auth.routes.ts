import { Elysia } from 'elysia'
import { authControllers } from '../controllers/auth.controllers.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/role.middleware.js'

export default new Elysia()
  .post('/signup', (context) => {
    console.log('Signup request body:', context.body)
    return authControllers.signup(context)
  })
  .post('/login', (context) => {
    console.log('Login request body:', context.body)
    return authControllers.login(context)
  })
  .post(
    '/admin/create-user',
    (context) => authControllers.createUser(context),
    {
      beforeHandle: [authMiddleware, requireRole(['ADMIN'])]
    }
  )
  .get(
    '/admin/stats',
    (context) => authControllers.getStats(context),
    {
      beforeHandle: [authMiddleware, requireRole(['ADMIN'])]
    }
  )