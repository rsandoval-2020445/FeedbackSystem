import User from "./user.model.js"
import mongoose from "mongoose"
import { encrypt, checkPassword } from "../../utils/encrypt.js"

// Obtener todos los usuarios (público)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Error retrieving users", error: err.message })
  }
}

// Obtener usuario por ID (público)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    console.log("Buscando usuario con ID:", id)
    console.log("Usuario autenticado:", req.user)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("ID inválido:", id)
      return res.status(400).json({ message: "Invalid user ID format" })
    }

    const user = await User.findById(id).select("-password")
    console.log("Usuario encontrado:", user)

    if (!user) {
      console.log("Usuario no encontrado")
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (err) {
    console.error("Error en getUserById:", err)
    res.status(500).json({ message: "Internal Server Error", error: err.message })
  }
}

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" })
    }

    const user = await User.findById(id)
    if (!user) return res.status(404).json({ message: "User not found" })

    if (req.body.password) {
      return res.status(400).json({ message: "Use the change password function" })
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password")
    res.status(200).json({ message: "User updated successfully", updatedUser })
  } catch (err) {
    console.error("Error updating user:", err)
    res.status(500).json({ message: "Internal Server Error", error: err.message })
  }
}


// Actualizar contraseña
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: "User not found" })

    const isMatch = await checkPassword(user.password, oldPassword)
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password" })

    user.password = await encrypt(newPassword)
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (err) {
    res.status(500).json({ message: "Error updating password", error: err.message })
  }
}

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" })
    }

    const user = await User.findById(id)
    if (!user) return res.status(404).json({ message: "User not found" })

    await User.findByIdAndDelete(id)
    res.status(200).json({ message: "User deleted successfully" })
  } catch (err) {
    console.error("Error deleting user:", err)
    res.status(500).json({ message: "Internal Server Error", error: err.message })
  }
}
