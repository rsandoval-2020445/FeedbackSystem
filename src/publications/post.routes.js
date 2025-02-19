import { Router } from 'express'
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from './post.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

api.get('/', getAllPosts)
api.get('/:id', getPostById)
api.post('/', validateJwt, createPost)
api.put('/:id', validateJwt, updatePost)
api.delete('/:id', validateJwt, deletePost)

export default api
