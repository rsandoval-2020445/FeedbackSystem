import bcrypt from "bcryptjs"
import User from "../users/user.model.js"
import jwt from "jsonwebtoken"
import { encrypt, checkPassword } from "../../utils/encrypt.js"

export const registerUser = async (req, res) => {
    try {
      const { name, surname, username, email, password, phone, role } = req.body
  
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ $or: [{ email }, { username }] })
      if (existingUser) return res.status(400).json({ message: "User already exists" })
  
      // Solo un ADMIN o SUPERADMIN pueden crear otro ADMIN
      if (role === "ADMIN" && (!req.user || (req.user.role !== "ADMIN" && req.user.role !== "SUPERADMIN"))) {
        return res.status(403).json({ message: "Only an ADMIN or SUPERADMIN can create another ADMIN" })
      }
  
      // Hashear la contraseña
      const hashedPassword = await encrypt(password)
  
      // Crear nuevo usuario
      const newUser = new User({ name, surname, username, email, password: hashedPassword, phone, role })
      await newUser.save()
  
      res.status(201).json({ success: true, message: "User registered successfully", user: newUser })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ message: "Internal server error", error: error.message })
    }
  }  


// Inicio de sesión
export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body
  
      // Buscar usuario en la base de datos
      const user = await User.findOne({ email })
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" })
  
      console.log("🔹 Contraseña ingresada:", password)
      console.log("🔹 Contraseña en la base de datos:", user.password)
  
      // Verificar la contraseña
      const isMatch = await checkPassword(user.password, password)
      console.log("🔹 ¿Coincide la contraseña?:", isMatch)
  
      if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" })
  
      // Generar token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "2h" })
      res.json({ token })
    } catch (error) {
      console.error("Error en el inicio de sesión:", error)
      res.status(500).json({ message: "Error en el inicio de sesión", error: error.message })
    }
  }
  
  


// Middleware para verificar token
export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) return res.status(401).json({ message: 'Acceso denegado' })

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).json({ message: 'Token inválido' })
    }
}
