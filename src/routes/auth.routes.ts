import { Elysia } from 'elysia'
import { authControllers } from '../controllers/auth.controllers.js'

export default new Elysia()
  .post('/signup', (context) => authControllers.signup(context))
  .post('/login', (context) => authControllers.login(context))