import { z } from 'zod';

export const resetPasswordSchema = z
.object({
  email: z.string().email(),
  security_question: z
  .string()
  .min(1, { message: 'Security question is required' }),
  answer: z.string().min(1, 'Answer is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
    ),
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;