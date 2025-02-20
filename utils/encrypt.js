import { hash, verify } from "argon2"

export const encrypt = async (password) => {
  try {
    return await hash(password)
  } catch (err) {
    console.error("Error encrypting password:", err)
    return err
  }
}

export const checkPassword = async (hashedPassword, password) => {
  try {
    console.log("🔹 Verificando contraseña con Argon2...")
    console.log("🔹 Hashed Password en DB:", hashedPassword)
    console.log("🔹 Contraseña ingresada:", password)

    const result = await verify(hashedPassword, password)
    console.log("🔹 Resultado de la verificación:", result)
    
    return result
  } catch (err) {
    console.error("Error verifying password:", err)
    return false
  }
}
