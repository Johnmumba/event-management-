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
  .group('/admin', (app) => app
    .use(authMiddleware)
    .get(
      '/stats',
      (context) => authControllers.getStats(context),
      {
        beforeHandle: [requireRole(['ADMIN'])]
      }
    )
    .get(
      '/users',
      (context) => authControllers.getAllUsers(context),
      {
        beforeHandle: [requireRole(['ADMIN'])]
      }
    )
    .put(
      '/users/:id/role',
      (context) => authControllers.updateUserRole(context),
      {
        beforeHandle: [requireRole(['ADMIN'])]
      }
    )
  )