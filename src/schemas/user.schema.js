import { z } from "zod";

const preferenceSchema = z.object({
  category: z.string({
    required_error: "Category is required",
  }),
});

export const registerSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
  fullname: z.string({
    required_error: "Fullname is required",
  }),
  biography: z.string({
    required_error: "Biography is required",
  }),
  gender: z.string({
    required_error: "Gender is required",
  }),
  avatar: z.string({
    required_error: "Avatar is required",
  }),
  preferences: z.array(preferenceSchema),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
