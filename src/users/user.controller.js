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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" })
    }
    const user = await User.findById(req.params.id).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: "Error retrieving user", error: err.message })
  }
}

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" })
    }
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    if (req.body.password) {
      return res.status(400).json({ message: "Use the change password function" })
    }

    if (user.role === "SUPERADMIN") {
      return res.status(403).json({ message: "SuperAdmin cannot be modified" })
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, select: "-password" })
    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message })
  }
}

// Actualizar contraseña
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: "User not found" })

    if (user.role === "SUPERADMIN" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "SuperAdmin password cannot be changed by others" })
    }

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" })
    }
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    if (user.role === "SUPERADMIN") {
      return res.status(403).json({ message: "SuperAdmin cannot be deleted" })
    }

    await User.findByIdAndDelete(req.params.id)
    res.json({ message: "User deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message })
  }
}
