import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    security_question: z
      .string()
      .min(1, { message: 'Security question is required' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm Password must be at least 8 characters' }),
    answer: z.string().min(1, { message: 'Answer is required' }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterInputs = z.infer<typeof registerSchema>;
