import User from '../src/users/user.model.js'
import { isValidObjectId } from 'mongoose'

export const existUsername = async (username) => {
    const alreadyUsername = await User.findOne({ username })
    if (alreadyUsername) {
        console.error(`Username ${username} is already taken`)
        throw new Error(`Username ${username} is already taken`)
    }
}

export const existEmail = async (email) => {
    const alreadyEmail = await User.findOne({ email })
    if (alreadyEmail) {
        console.error(`Email ${email} is already taken`)
        throw new Error(`Email ${email} is already taken`)
    }
}

export const objectIdValid = async (objectId) => {
    if (!isValidObjectId(objectId)) {
        throw new Error(`ID is not a valid ObjectId`)
    }
}

export const findUser = async (id) => {
    try {
        const userExist = await User.findOne({ _id: id })
        if (!userExist) return false
        return userExist
    } catch (err) {
        console.error(err)
        return false
    }
}