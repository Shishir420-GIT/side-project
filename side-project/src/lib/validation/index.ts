import * as z from "zod"

// 1. Define your schema.
export const SignupValidation = z.object({
    name: z.string().min(2, { message: "Too short"}),
    username: z.string().min(2).max(50),
    email: z.string().email({ message: "Invalid email"}),
    password: z.string().min(8, { message: "Password must be 8 characters"})
})

export const SigninValidation = z.object({
    email: z.string().email({ message: "Invalid email"}),
    password: z.string().min(8, { message: "Password must be 8 characters"})
})