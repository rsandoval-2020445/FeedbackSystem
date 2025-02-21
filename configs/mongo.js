import mongoose from "mongoose"

export const connect = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB | Already connected")
      return
    }

    console.log("MongoDB | Trying to connect...")

    // Eventos de conexión
    mongoose.connection.on("error", () => console.log("MongoDB | Could not connect"))
    mongoose.connection.on("connected", () => console.log("MongoDB | Successfully connected"))
    mongoose.connection.once("open", () => console.log("MongoDB | Connection is open"))
    mongoose.connection.on("disconnected", () => console.log("MongoDB | Disconnected"))

    // Conectar a la BD
    await mongoose.connect(
      `${process.env.DB_SERVICE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      {
        maxPoolSize: 50,
        serverSelectionTimeoutMS: 5000,
      }
    )

  } catch (err) {
    console.error("Database connection failed:", err)
    process.exit(1) // Si la conexión falla, detener la app
  }
}
