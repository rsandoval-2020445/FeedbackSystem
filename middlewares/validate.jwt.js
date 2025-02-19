import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../src/users/user.model.js'

export const validateJwt = async (req, res, next) => {
  try {
    const secretKey = process.env.JWT_SECRET
    if (!secretKey) {
      console.error('JWT_SECRET is missing.')
      return res.status(500).send({ message: 'Internal server error' })
    }

    const token = req.headers['x-access-token'] || req.headers['authorization']
    if (!token) {
      return res.status(401).send({ message: 'Unauthorized: Token missing' })
    }

    let decoded
    try {
      decoded = jwt.verify(token, secretKey)
    } catch (err) {
      console.error('JWT verification error:', err.message)
      return res.status(401).send({ message: 'Invalid or expired token' })
    }

    const userId = decoded._id || decoded.userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid user ID in token:', userId)
      return res.status(400).send({ message: 'Invalid token: User ID is not valid' })
    }

    const user = await User.findById(userId)
    if (!user) {
      console.error('User not found:', userId)
      return res.status(404).send({ message: 'User not found' })
    }

    req.user = user
    next()
  } catch (err) {
    console.error('Unexpected error in validateJwt:', err)
    return res.status(500).send({ message: 'Internal server error', error: err.message })
  }
}

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).send({
        success: false,
        message: `You don't have access | username ${req.user?.username || 'Unknown'}`
      })
    }
    next()
  } catch (err) {
    console.error('Error in isAdmin middleware:', err)
    return res.status(403).send({
      success: false,
      message: 'Unauthorized role'
    })
  }
}
