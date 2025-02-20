import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import authRoutes from "./auth/auth.routes.js" 
import userRoutes from "./users/user.routes.js"
import categoryRoutes from "./categories/category.routes.js"
import postRoutes from "./publications/post.routes.js"
import commentRoutes from "./comments/comment.routes.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))

app.use("/api/auth", authRoutes)  // 👈 Asegúrate de que esta línea está aquí
app.use("/api/users", userRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)

app.listen(process.env.PORT || 3626, () => {
  console.log(`Server running on port ${process.env.PORT || 3626}`)
})
