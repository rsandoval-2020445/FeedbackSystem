import bcrypt from "bcryptjs"
import User from "./user.model.js"
import dotenv from "dotenv"

dotenv.config() // Cargar variables de entorno

export const createSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({ role: "SUPERADMIN" })
    if (existingSuperAdmin) return

    const hashedPassword = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD || "SuperAdmin123!", 10)

    const superAdmin = new User({
      name: process.env.SUPERADMIN_NAME || "Super",
      surname: process.env.SUPERADMIN_SURNAME || "Admin",
      username: process.env.SUPERADMIN_USERNAME || "superadmin",
      email: process.env.SUPERADMIN_EMAIL || "superadmin@example.com",
      password: hashedPassword,
      phone: process.env.SUPERADMIN_PHONE || "0000000000",
      role: "SUPERADMIN",
    })

    await superAdmin.save()
    console.log("SuperAdmin created successfully")
  } catch (error) {
    console.error("Error creating SuperAdmin:", error)
  }
}
