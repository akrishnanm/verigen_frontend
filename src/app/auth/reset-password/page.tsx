"use client"

import { Box, Button, TextField, Typography, Avatar } from "@mui/material"
import KeyIcon from "@mui/icons-material/Key"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useResetPasswordMutation } from "./_reset_password.api"
import { resetPasswordSchema, type ResetPasswordInputs } from "./_reset_passeord.schema"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const securityQuestion = searchParams.get('security_question');
  
  const methods = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email || '',
      security_question: securityQuestion || '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  const router = useRouter()
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const onSubmitHandler = async (data: ResetPasswordInputs) => {
    const transformedData = {
      email: data.email,
      answer: data.answer,
      new_password: data.password,
    };

    try {
      await resetPassword(transformedData)
      router.push("login")
      console.log(transformedData)
    } catch (error) {
      console.error("Failed to reset password:", error)
    }
  }

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          sx={{
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              mb: 1,
              bgcolor: "primary.light",
              width: 48,
              height: 48,
            }}
          >
            <KeyIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 0.5 }}>
            Verify User
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
            Fill the details as given during the time of sign up
          </Typography>

          <TextField
            fullWidth
            label="Security Question"
            {...register('security_question')}
            error={!!errors.security_question}
            helperText={errors.security_question?.message}
            required
          />

          <TextField
            fullWidth
            label="Answer"
            {...register('answer')}
            error={!!errors.answer}
            helperText={errors.answer?.message}
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            required
            autoComplete="new-password"
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              mt: 1,
              py: 1.5,
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  )
}

