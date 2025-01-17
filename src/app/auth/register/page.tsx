'use client';

import { TextField, Button, Typography, Box, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RegisterInputs, registerSchema } from './_register.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterUserMutation } from './_register.api';

export default function Register() {
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    try {
      await registerUser(data);
    } catch (err) {
      console.error('Failed to register:', err);
    }
  };

  return (
    <>
      <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
        Register
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
              {...register('name')}
              fullWidth
              label="Name"
              placeholder="Enter your name"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
              required
            />
          </Grid>
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
              placeholder="Create a password"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              {...register('confirmPassword')}
              fullWidth
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              variant="outlined"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              {...register('security_question')}
              fullWidth
              label="Security Question"
              placeholder="Ex. What was the name of your first school?"
              variant="outlined"
              error={!!errors.security_question}
              helperText={errors.security_question?.message}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              {...register('answer')}
              fullWidth
              label="Answer"
              variant="outlined"
              error={!!errors.answer}
              helperText={errors.answer?.message}
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
          {isLoading ? 'Registering...' : 'Register'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Have an account?{' '}
            <Link href="/" underline="hover" sx={{ fontWeight: 'medium' }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
