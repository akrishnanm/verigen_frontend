'use client';

import { TextField, Button, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForgotPasswordMutation } from './_forgot_password.api';
import { ForgotPasswordInputs, forgotPasswordSchema } from './_forgot_password.schema';
import Link from '@/components/Link';

export default function ForgotPassword() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    try {
      await forgotPassword(data);
    } catch (err) {
      console.error('Invalid email:', err);
    }
  };

  return (
    <>
      <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
      Forgot Password 
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {`No worries, we'll send you reset instructions.`}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: '100%' }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              {...register('email')}
              fullWidth
              label="Email"
              type="email"
              placeholder="Enter your email"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              required
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          size="large"
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Proceed'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            {"Remember your password? "}
            <Link href="login">Sign in</Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
