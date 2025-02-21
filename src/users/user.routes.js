import express from "express"
import { getAllUsers, getUserById, updateUser, deleteUser } from "./user.controller.js"
import { validateJwt, isAdmin } from "../../middlewares/validate.jwt.js"

const router = express.Router()

router.get("/", validateJwt, getAllUsers)
router.get("/:id", validateJwt, getUserById)
router.put("/:id", validateJwt, updateUser)
router.delete("/:id", validateJwt, isAdmin, deleteUser) // Solo ADMIN puede eliminar

export default router
