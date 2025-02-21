// validators.js
import { body } from "express-validator"
import { validateErrors, validateErrorWithoutImg } from "./validate.error.js"
import { existEmail, existUsername, objectIdValid } from "./db.validators.js"

export const registerValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('surname', 'Surname cannot be empty').notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({ min: 8 }),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .notEmpty()
        .isMobilePhone(),
    body('role')
        .optional()
        .custom((role, { req }) => {
            if (role === "ADMIN" && (!req.user || req.user.role !== "ADMIN")) {
                throw new Error("Only an existing ADMIN can create another ADMIN.")
            }
            return true
        }),
    validateErrors
]

export const loginValidator = [
    body('userLoggin', 'Username or Email cannot be empty').notEmpty(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({ min: 8 }),
    validateErrorWithoutImg
]
