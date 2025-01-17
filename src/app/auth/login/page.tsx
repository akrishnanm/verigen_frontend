'use client';

import { TextField, Button, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginUserMutation } from './_login.api';
import { LoginInputs, loginSchema } from './_login.schema';
import Link from '@/app/components/Link';

export default function Login() {
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      await loginUser(data);
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  return (
    <>
      <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
        Login
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Please enter your details
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
          <Grid size={{ xs: 12 }}>
            <TextField
              {...register('password')}
              fullWidth
              label="Password"
              type="password"
              placeholder="Enter password"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
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
          {isLoading ? 'Logging In...' : 'Login'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            {"Don't have an account? "}
            <Link href="register">Sign Up</Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
