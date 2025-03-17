import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 8 characters"),
    name: z.string().min(3, "Name should be atleast 3 characters"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 8 characters"),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
export const updatePasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 8 characters"),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;
