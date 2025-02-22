import { Router } from 'express'
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from './category.controller.js'
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'

const router = Router()

router.post('/', validateJwt, isAdmin, createCategory)
router.get('/', getAllCategories)
router.get('/:id', getCategoryById)
router.put('/:id', validateJwt, isAdmin, updateCategory)
router.delete('/:id', validateJwt, isAdmin, deleteCategory)

export default router
