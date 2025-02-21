// rate.limit.js
import rateLimit from "express-rate-limit"

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo de 100 peticiones por IP
    message: { message: "You're blocked, wait 15 minutes" }
})