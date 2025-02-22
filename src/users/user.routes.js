import express from "express"
import { getAllUsers, getUserById, updateUser, updatePassword, deleteUser } from "./user.controller.js"
import { validateJwt, isAdmin } from "../../middlewares/validate.jwt.js"

const router = express.Router()

router.get("/", validateJwt, getAllUsers)
router.get("/:id", validateJwt, getUserById)
router.put("/:id", validateJwt, updateUser)

// Ruta para actualizar la contraseña
router.patch("/update-password", validateJwt, updatePassword)

router.delete("/:id", validateJwt, isAdmin, deleteUser)

export default router
