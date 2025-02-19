import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import userRoutes from '../src/users/user.routes.js'
import categoryRoutes from '../src/categories/category.routes.js'
import postRoutes from '../src/publications/post.routes.js'
import commentRoutes from '../src/comments/comment.routes.js'

const configs = (app) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cors())
  app.use(helmet())
  app.use(morgan('dev'))
}

const routes = (app) => {
  app.use('/api/users', userRoutes)
  app.use('/api/categories', categoryRoutes)
  app.use('/api/posts', postRoutes)
  app.use('/api/comments', commentRoutes)
}

export const initServer = async () => {
  const app = express()
  try {
    configs(app)
    routes(app)
    app.listen(process.env.PORT)
    console.log(`Server running on port ${process.env.PORT}`)
  } catch (err) {
    console.error('Server init failed:', err)
  }
}
