import { Elysia } from 'elysia'
import { authControllers } from '../controllers/auth.controllers.js'

export default new Elysia()
  .post('/signup', (context) => {
    console.log('Signup request body:', context.body)
    return authControllers.signup(context)
  })
  .post('/login', (context) => {
    console.log('Login request body:', context.body)
    return authControllers.login(context)
  })