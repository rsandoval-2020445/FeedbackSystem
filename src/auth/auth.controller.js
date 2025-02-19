import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../users/user.model.js'
import { encrypt, checkPassword } from '../../utils/encrypt.js'

// Registro de usuario
export const register = async (req, res) => {
    try {
      const { name, surname, username, email, password, phone, role } = req.body
  
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ $or: [{ email }, { username }] })
      if (existingUser) return res.status(400).json({ message: "User already exists" })
  
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
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Buscar usuario
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

        // Comparar contraseña
        const isMatch = await checkPassword(user.password, password)
        if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' })

        // Generar token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' })
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } })
    } catch (error) {
        res.status(500).json({ message: 'Error en el inicio de sesión', error })
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
