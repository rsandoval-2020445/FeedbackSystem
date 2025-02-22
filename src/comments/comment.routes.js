import { Router } from 'express'
import { createComment, getCommentsByPost, updateComment, deleteComment } from './comment.controller.js'
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'

const api = Router()

api.get('/:postId', getCommentsByPost)
api.post('/', validateJwt, createComment)
api.put('/:id', validateJwt, updateComment)
api.delete('/:id', validateJwt, isAdmin, deleteComment) // Un ADMIN también puede eliminar

export default api
