import { Elysia } from 'elysia'
import { authControllers } from '../controllers/auth.controllers.js'

export default new Elysia()
  .post('/signup', ({ body }: any) => authControllers.signup({ body }))
  .post('/login', ({ body }: any) => authControllers.login({ body }))