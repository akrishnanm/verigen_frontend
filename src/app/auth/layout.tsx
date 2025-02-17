import GuestGuard from '@/components/GuestGuard';
import { Container, Box, Paper } from '@mui/material';

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuestGuard>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'grey.100',
          py: 4, // Extra padding for responsiveness
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {children}
          </Paper>
        </Container>
      </Box>
    </GuestGuard>
  );
}
